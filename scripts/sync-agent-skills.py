#!/usr/bin/env python3
"""Restore the audited, project-local Codex skills from exact Git commits."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import uuid
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / ".agents" / "skills.lock.json"
SKILLS_DIR = ROOT / ".agents" / "skills"


def run(command: list[str], cwd: Path | None = None) -> None:
    printable = " ".join(command)
    print(f"[skills] {printable}")
    subprocess.run(command, cwd=cwd, check=True)


def directory_digest(directory: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(item for item in directory.rglob("*") if item.is_file()):
        digest.update(path.relative_to(directory).as_posix().encode("utf-8"))
        digest.update(b"\0")
        content = path.read_bytes()
        try:
            content = content.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")
        except UnicodeDecodeError:
            pass
        digest.update(content)
        digest.update(b"\0")
    return digest.hexdigest()


def declared_skill_name(skill_file: Path) -> str | None:
    lines = skill_file.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith("name:"):
            return line.split(":", 1)[1].strip().strip('"\'')
    return None


def install_copy(source: Path, destination: Path, force_update: bool) -> str:
    if destination.exists() and directory_digest(source) == directory_digest(destination):
        return "verified"

    if destination.exists() and not force_update:
        raise RuntimeError(
            f"{destination} differs from the audited lock. Review the diff and rerun with "
            "--force-update only after approving the replacement."
        )

    destination.parent.mkdir(parents=True, exist_ok=True)
    staged = destination.parent / f".{destination.name}.staged-{uuid.uuid4().hex}"
    shutil.copytree(source, staged)

    if not destination.exists():
        staged.replace(destination)
        return "installed"

    backup = destination.parent / f".{destination.name}.backup-{uuid.uuid4().hex}"
    destination.replace(backup)
    try:
        staged.replace(destination)
    except Exception:
        backup.replace(destination)
        raise
    shutil.rmtree(backup)
    return "updated"


def checkout_repository(url: str, commit: str, target: Path) -> None:
    run(["git", "init", "--quiet", str(target)])
    run(["git", "-C", str(target), "remote", "add", "origin", url])
    run(["git", "-C", str(target), "fetch", "--quiet", "--depth", "1", "origin", commit])
    run(["git", "-C", str(target), "checkout", "--quiet", "--detach", "FETCH_HEAD"])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", default="codex", choices=["codex"])
    parser.add_argument(
        "--force-update",
        action="store_true",
        help="Replace a differing installed copy after its source/commit was reviewed.",
    )
    args = parser.parse_args()

    if not LOCK_PATH.exists():
        raise RuntimeError(f"Lock file not found: {LOCK_PATH}")
    if not shutil.which("git"):
        raise RuntimeError("git was not found in PATH")

    lock = json.loads(LOCK_PATH.read_text(encoding="utf-8"))
    if lock.get("agent") != args.agent:
        raise RuntimeError(f"Lock targets {lock.get('agent')!r}, not {args.agent!r}")

    grouped: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for skill in lock.get("skills", []):
        grouped[(skill["url"], skill["commit"])].append(skill)

    results: list[tuple[str, str]] = []
    with tempfile.TemporaryDirectory(prefix="wicolly-agent-skills-") as temp_root:
        temp_root_path = Path(temp_root)
        for index, ((url, commit), skills) in enumerate(grouped.items()):
            checkout = temp_root_path / f"source-{index}"
            checkout_repository(url, commit, checkout)

            for skill in skills:
                source = (checkout / skill["path"]).resolve()
                if not source.is_relative_to(checkout.resolve()):
                    raise RuntimeError(f"Unsafe source path for {skill['name']}")
                skill_file = source / "SKILL.md"
                if not skill_file.exists():
                    raise RuntimeError(f"SKILL.md not found for {skill['name']} at {source}")
                if declared_skill_name(skill_file) != skill["name"]:
                    raise RuntimeError(f"Declared name mismatch for {skill['name']}")

                destination = (SKILLS_DIR / skill["name"]).resolve()
                if not destination.is_relative_to(SKILLS_DIR.resolve()):
                    raise RuntimeError(f"Unsafe destination for {skill['name']}")
                results.append(
                    (skill["name"], install_copy(source, destination, args.force_update))
                )

    for name, status in results:
        print(f"[skills] {name}: {status}")
    print(f"[skills] {len(results)} project-local Codex skills are aligned with {LOCK_PATH.name}.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as error:
        print(f"[skills] Git command failed with exit code {error.returncode}.")
        raise SystemExit(error.returncode)
    except Exception as error:  # noqa: BLE001 - command-line boundary
        print(f"[skills] Error: {error}")
        raise SystemExit(1)
