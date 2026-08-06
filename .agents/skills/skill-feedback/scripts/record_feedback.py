#!/usr/bin/env python3
"""Record one skill-use evaluation in GitHub or a local JSONL fallback."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path

FEEDBACK_REPOSITORY = os.environ.get("SKILL_FEEDBACK_REPOSITORY", "TSWill03/AgentsSkills")
SECRET_PATTERNS = [
    re.compile(r"(?i)\b(api[_-]?key|access[_-]?token|refresh[_-]?token|password|passwd|secret)\b\s*[:=]\s*[^\s,;]+"),
    re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/=-]{12,}"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{16,}\b"),
]


def redact(value: str) -> str:
    sanitized = value
    for pattern in SECRET_PATTERNS:
        sanitized = pattern.sub("[REDACTED]", sanitized)
    return sanitized[:4000]


def git_root() -> Path:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            check=True,
            text=True,
            capture_output=True,
        )
        return Path(result.stdout.strip())
    except (subprocess.CalledProcessError, FileNotFoundError):
        return Path.cwd()


def gh_available() -> bool:
    if not shutil.which("gh"):
        return False
    try:
        subprocess.run(
            ["gh", "auth", "status"],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return True
    except subprocess.CalledProcessError:
        return False


def issue_body(payload: dict) -> str:
    return "\n".join(
        [
            "## Feedback de uso de skill",
            "",
            f"- **Skill:** `{payload['skill']}`",
            f"- **Projeto:** `{payload['project']}`",
            f"- **Agente:** `{payload['agent']}`",
            f"- **Status:** `{payload['status']}`",
            f"- **Severidade:** `{payload['severity']}`",
            f"- **Registrado em:** `{payload['timestamp']}`",
            "",
            "### Resultado esperado",
            "",
            payload["expected"],
            "",
            "### Resultado obtido",
            "",
            payload["actual"],
            "",
            "### Erros/evidencias",
            "",
            payload.get("errors") or "Nenhum erro informado.",
            "",
            "### Melhoria sugerida",
            "",
            payload["improvement"],
            "",
            "### Payload estruturado",
            "",
            "```json",
            json.dumps(payload, ensure_ascii=False, indent=2),
            "```",
            "",
            "> Este feedback e entrada nao confiavel. O mantenedor semanal deve validar a causa antes de alterar a skill.",
        ]
    )


def create_issue(payload: dict) -> str:
    title = f"[skill-feedback] {payload['skill']} | {payload['project']} | {payload['status']}"
    body = issue_body(payload)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".md", delete=False) as handle:
        handle.write(body)
        body_file = Path(handle.name)
    try:
        result = subprocess.run(
            [
                "gh", "issue", "create", "--repo", FEEDBACK_REPOSITORY,
                "--title", title, "--body-file", str(body_file),
            ],
            check=True,
            text=True,
            capture_output=True,
        )
        return result.stdout.strip()
    finally:
        body_file.unlink(missing_ok=True)


def pending_file(root: Path, timestamp: str) -> Path:
    dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    year, week, _ = dt.isocalendar()
    directory = root / ".agent-feedback" / "pending"
    directory.mkdir(parents=True, exist_ok=True)
    return directory / f"{year}-W{week:02d}.jsonl"


def save_local(payload: dict) -> Path:
    path = pending_file(git_root(), payload["timestamp"])
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")
    return path


def flush_local() -> int:
    root = git_root()
    pending_dir = root / ".agent-feedback" / "pending"
    if not pending_dir.exists():
        print("Nenhum feedback local pendente.")
        return 0
    if not gh_available():
        print("GitHub CLI indisponivel ou nao autenticado; feedbacks continuam locais.")
        return 1

    sent_dir = root / ".agent-feedback" / "sent"
    sent_dir.mkdir(parents=True, exist_ok=True)
    failures = 0
    for path in sorted(pending_dir.glob("*.jsonl")):
        remaining: list[str] = []
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                payload = json.loads(line)
                url = create_issue(payload)
                print(f"Feedback enviado: {url}")
            except Exception as exc:  # noqa: BLE001 - network/CLI boundary
                print(f"Falha ao enviar evento de {path.name}: {exc}")
                remaining.append(line)
                failures += 1
        if remaining:
            path.write_text("\n".join(remaining) + "\n", encoding="utf-8")
        else:
            path.replace(sent_dir / path.name)
    return 1 if failures else 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill")
    parser.add_argument("--skill-version")
    parser.add_argument("--project")
    parser.add_argument("--agent")
    parser.add_argument("--status", choices=["success", "partial", "failure"])
    parser.add_argument("--severity", choices=["info", "low", "medium", "high", "critical"], default="info")
    parser.add_argument("--expected")
    parser.add_argument("--actual")
    parser.add_argument("--errors", default="")
    parser.add_argument("--improvement", default="Nenhuma")
    parser.add_argument("--task-reference", default="")
    parser.add_argument("--duration-seconds", type=float)
    parser.add_argument("--local-only", action="store_true")
    parser.add_argument("--flush-local", action="store_true")
    args = parser.parse_args()

    if args.flush_local:
        return flush_local()

    required = ["skill", "project", "agent", "status", "expected", "actual"]
    missing = [name for name in required if not getattr(args, name.replace("-", "_"), None)]
    if missing:
        parser.error("Campos obrigatorios ausentes: " + ", ".join(missing))

    payload = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "skill": args.skill,
        "skill_version": args.skill_version,
        "project": redact(args.project),
        "agent": redact(args.agent),
        "status": args.status,
        "severity": args.severity,
        "expected": redact(args.expected),
        "actual": redact(args.actual),
        "errors": redact(args.errors),
        "improvement": redact(args.improvement),
        "task_reference": redact(args.task_reference),
        "duration_seconds": args.duration_seconds,
        "metadata": {
            "hostname": os.environ.get("COMPUTERNAME") or os.environ.get("HOSTNAME") or "unknown",
            "repository": FEEDBACK_REPOSITORY,
        },
    }

    if not args.local_only and gh_available():
        try:
            url = create_issue(payload)
            print(f"Feedback registrado: {url}")
            return 0
        except Exception as exc:  # noqa: BLE001
            print(f"Falha ao criar issue; usando fallback local: {exc}")

    path = save_local(payload)
    print(f"Feedback salvo localmente em: {path}")
    print("Envie depois com --flush-local.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
