(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitButton = document.getElementById("submitBtn");
  const submitLabel = submitButton.querySelector(".submit-label");
  const error = document.getElementById("formError");
  const body = document.getElementById("modalBody");
  const success = document.getElementById("modalSuccess");

  document.addEventListener("submit", async (event) => {
    if (event.target !== form) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    error.replaceChildren();

    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitLabel.textContent = "Sending…";

    const data = Object.fromEntries(new FormData(form));
    const mailto = `mailto:melissa@missyve.co?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    )}`;

    try {
      const response = await fetch("https://formsubmit.co/ajax/melissa@missyve.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (!response.ok || String(result.success).toLowerCase() === "false") {
        throw new Error("The contact service could not accept the message.");
      }

      body.hidden = true;
      success.hidden = false;
      form.reset();
    } catch {
      error.append(
        document.createTextNode("We couldn't send your message. "),
        Object.assign(document.createElement("a"), {
          href: mailto,
          textContent: "Email us directly instead."
        })
      );
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Send message";
    }
  }, true);
})();
