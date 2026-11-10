(() => {
  "use strict";
  const form = document.getElementById("start-form");
  const phone = document.getElementById("phone");
  const consent = document.getElementById("consent");
  const status = document.getElementById("form-status");
  if (!form || !phone || !consent || !status) return;

  const BOT_WHATSAPP = "5564993252339";
  function normalizeBRPhone(raw) {
    let number = String(raw ?? "").replace(/\D/g, "");
    if (number.startsWith("55") && (number.length === 12 || number.length === 13)) {
      number = number.slice(2);
    }
    if (![10, 11].includes(number.length)) return null;
    const ddd = Number(number.slice(0, 2));
    if (ddd < 11 || ddd > 99) return null;
    // Do not attempt to derive a WhatsApp JID from this number: only the bridge may resolve it.
    if (number.length === 11 && number[2] !== "9") return null;
    if (/^(\d)\1+$/.test(number.slice(2))) return null;
    return "55" + number;
  }
  function maskPhone(value) {
    const digits = String(value).replace(/\D/g, "");
    let n = digits;
    if (n.startsWith("55") && n.length > 11) n = n.slice(2);
    n = n.slice(0, 11);
    if (n.length <= 2) return n.length ? "(" + n : "";
    const ddd = n.slice(0, 2);
    const rest = n.slice(2);
    if (rest.length <= 5) return "(" + ddd + ") " + rest;
    const split = rest.length === 9 ? 5 : 4;
    return "(" + ddd + ") " + rest.slice(0, split) + "-" + rest.slice(split);
  }
  phone.addEventListener("input", () => {
    status.textContent = "";
    const selection = phone.selectionStart;
    if (selection === phone.value.length) phone.value = maskPhone(phone.value);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const normalized = normalizeBRPhone(phone.value);
    if (!normalized) {
      status.textContent = "Confira o DDD e informe um telefone brasileiro válido.";
      phone.focus();
      return;
    }
    if (!consent.checked) {
      status.textContent = "Precisamos do seu consentimento para iniciar a solicitação.";
      consent.focus();
      return;
    }
    // A static webpage cannot send WhatsApp messages or verify an OTP.
    // The visitor explicitly sends the request from their WhatsApp; the gateway
    // must independently verify sender identity and permission before any response.
    const message = [
      "INICIAR TESTE MEUX",
      "Numero informado: +" + normalized,
      "Confirmo que solicitei acesso pelo site e aceito receber mensagens deste teste."
    ].join("\n");
    const link = "https://wa.me/" + BOT_WHATSAPP + "?text=" + encodeURIComponent(message);
    status.textContent = "Abrindo WhatsApp. Toque em Enviar para solicitar acesso; a liberação não é automática.";
    window.location.assign(link);
  });
  // The formatting helper is exposed only for deterministic local tests.
  Object.defineProperty(window, "meuxPhoneValidator", {
    value: normalizeBRPhone, configurable: false, writable: false
  });
})();
