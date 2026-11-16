(() => {
  const endpoint = "https://formsubmit.co/ajax/melissa@missyve.co";

  function validateField(field) {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    if (!error) return true;
    let message = "";
    if (!field.value.trim()) message = "Please complete this field.";
    else if (field.type === "email" && !field.validity.valid) message = "Please enter a valid email address.";
    error.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  document.querySelectorAll("[data-open]").forEach((button) => {
    const dialog = document.getElementById(`${button.dataset.open}-dialog`);
    const form = dialog.querySelector("form");
    const success = dialog.querySelector(".success");
    button.addEventListener("click", () => {
      if (!success.hidden) {
        success.hidden = true;
        form.hidden = false;
      }
      dialog.showModal();
      form.querySelector('input[name="name"]').focus();
    });
    dialog.querySelectorAll(".dialog-close, [data-close]").forEach((close) => {
      close.addEventListener("click", () => dialog.close());
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener("close", () => button.focus());

    form.querySelectorAll("[required]").forEach((field) => {
      field.addEventListener("input", () => {
        if (field.hasAttribute("aria-invalid")) validateField(field);
      });
      field.addEventListener("change", () => {
        if (field.hasAttribute("aria-invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const required = Array.from(form.querySelectorAll("[required]"));
      const invalid = required.filter((field) => !validateField(field));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }
      const submit = form.querySelector('button[type="submit"]');
      const error = form.querySelector(".submission-error");
      submit.disabled = true;
      submit.textContent = "Sending...";
      error.hidden = true;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const result = await response.json();
        if (!response.ok || String(result.success).toLowerCase() !== "true") {
          throw new Error("The inquiry service could not accept the message.");
        }
        form.reset();
        form.hidden = true;
        success.hidden = false;
        if (dialog.open) success.focus();
      } catch (sendError) {
        console.error("Workshop inquiry failed", sendError);
        error.hidden = false;
      } finally {
        submit.disabled = false;
        submit.textContent = "Send inquiry";
      }
    });
  });

  document.querySelectorAll("[data-download]").forEach(async (link) => {
    try {
      const response = await fetch(link.href, { headers: { Range: "bytes=0-4" } });
      if (response.status === 404) return;
      if (!response.ok) throw new Error(`Download check failed: ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-") {
        link.hidden = false;
      } else {
        console.error("Download is not a PDF:", link.pathname);
      }
    } catch (error) {
      console.error("Could not check workshop overview:", link.pathname, error);
    }
  });
})();
