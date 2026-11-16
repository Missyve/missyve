(() => {
  const form = document.querySelector(".inquiry form");
  const error = form.querySelector(".error");
  const button = form.querySelector('button[type="submit"]');
  const success = document.querySelector(".success");
  let requestId = "";
  let timer;

  form.addEventListener("invalid", () => {
    error.textContent = "Please complete the required fields and enter a valid email address.";
  }, true);
  for (const field of [form.elements.name, form.elements.organization]) {
    field.addEventListener("input", () => field.setCustomValidity(""));
  }
  form.addEventListener("submit", (event) => {
    for (const field of [form.elements.name, form.elements.organization]) {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    }
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }
    if (!window.crypto || !window.crypto.randomUUID) {
      event.preventDefault();
      error.textContent = "Your browser cannot submit this request securely. Please email melissa@curaite.events.";
      return;
    }
    requestId = window.crypto.randomUUID();
    form.elements.requestId.value = requestId;
    error.textContent = "";
    button.disabled = true;
    button.textContent = "Sending...";
    timer = window.setTimeout(() => {
      requestId = "";
      button.disabled = false;
      button.textContent = "Send request";
      error.textContent = "We could not confirm your request. Please try again or email melissa@curaite.events.";
    }, 45000);
  });
  window.addEventListener("message", (event) => {
    if (!/^https:\/\/(?:[a-z0-9-]+\.)*googleusercontent\.com$/i.test(event.origin)) return;
    if (!requestId || !event.data || event.data.type !== "speakingInquiryResult" || event.data.requestId !== requestId) return;
    window.clearTimeout(timer);
    requestId = "";
    button.disabled = false;
    button.textContent = "Send request";
    if (event.data.ok === true) {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } else {
      error.textContent = "Something went wrong. Please try again or email melissa@curaite.events.";
    }
  });
})();
