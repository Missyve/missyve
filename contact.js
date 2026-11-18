(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitButton = document.getElementById("submitBtn");
  const submitLabel = submitButton.querySelector(".submit-label");
  const error = document.getElementById("formError");
  const body = document.getElementById("modalBody");
  const success = document.getElementById("modalSuccess");

  async function sendContact(data) {
    const response = await fetch("https://formsubmit.co/ajax/melissa@missyve.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok || String(result.success).toLowerCase() !== "true") {
      throw new Error("The contact service could not accept the message.");
    }
  }

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
      await sendContact(data);

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

  document.addEventListener("submit", async (event) => {
    const speakingForm = event.target;
    if (!(speakingForm instanceof HTMLFormElement) || speakingForm.id !== "speakingForm") return;
    event.preventDefault();

    for (const field of [speakingForm.elements.name, speakingForm.elements.organization]) {
      field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    }
    const eventDetails = speakingForm.elements.event_details;
    eventDetails.setCustomValidity(eventDetails.value.trim()
      ? ""
      : "Please share a little about your event so I can recommend the right talk.");
    if (!speakingForm.reportValidity()) return;

    const button = speakingForm.querySelector('button[type="submit"]');
    const error = speakingForm.querySelector(".form-error");
    const dialog = speakingForm.closest("dialog");
    const content = dialog.querySelector(".speaking-form-content");
    const confirmation = dialog.querySelector(".modal-success");
    const data = Object.fromEntries(new FormData(speakingForm));
    const message = `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization}\nEvent date: ${data.eventDate || "Not provided"}\nExpected audience size: ${data.audience || "Not provided"}\nFormat: ${data.format}\n\nTell me about your event:\n${data.event_details}\n\nLogistics:\n${data.notes || "Not provided"}`;
    error.replaceChildren();
    button.disabled = true;
    button.textContent = "Sending...";
    try {
      await sendContact(data);
      content.hidden = true;
      confirmation.hidden = false;
      if (dialog.open) confirmation.focus();
      speakingForm.reset();
    } catch (sendError) {
      console.error("Speaking request failed", sendError);
      const mailto = `mailto:melissa@missyve.co?subject=${encodeURIComponent(data._subject)}&body=${encodeURIComponent(message)}`;
      error.append(
        document.createTextNode("We couldn't send your request. "),
        Object.assign(document.createElement("a"), { href: mailto, textContent: "Email me directly instead." })
      );
    } finally {
      button.disabled = false;
      button.textContent = "Send request";
    }
  }, true);

  document.addEventListener("input", (event) => {
    if (event.target.closest("#speakingForm") && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
      event.target.setCustomValidity("");
    }
  });
})();
