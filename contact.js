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

  function sendSpeakingInquiry(data) {
    const endpoint = window.MISSYVE_APPS_SCRIPT_ENDPOINT;
    if (!endpoint) return Promise.reject(new Error("The speaking request service is not configured."));

    const requestId = window.crypto.randomUUID();
    const values = {
      name: data.name,
      email: data.email,
      organization: data.organization,
      eventDate: data.eventDate,
      audience: data.audience,
      format: data.format,
      event_details: data.event_details,
      speaking_budget: data.speaking_budget,
      notes: data.notes,
      requestId,
      website: data._honey || ""
    };
    const submission = new URLSearchParams();
    for (const [name, value] of Object.entries(values)) {
      submission.append(name, String(value || ""));
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 30000);
    return fetch(`${endpoint}?formType=speakingInquiry`, {
      method: "POST",
      mode: "no-cors",
      body: submission,
      signal: controller.signal
    }).then(() => undefined).finally(() => {
      window.clearTimeout(timeoutId);
    });
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
    } catch (sendError) {
      console.error("Contact message failed", sendError);
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
    const speakingBudget = speakingForm.elements.speaking_budget;
    speakingBudget.setCustomValidity(speakingBudget.value
      ? ""
      : "Please choose a budget range so I can recommend the right format.");
    if (!speakingForm.reportValidity()) return;

    const button = speakingForm.querySelector('button[type="submit"]');
    const error = speakingForm.querySelector(".form-error");
    const dialog = speakingForm.closest("dialog");
    const content = dialog.querySelector(".speaking-form-content");
    const confirmation = dialog.querySelector(".modal-success");
    const data = Object.fromEntries(new FormData(speakingForm));
    const message = `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization}\nEvent date: ${data.eventDate || "Not provided"}\nExpected audience size: ${data.audience || "Not provided"}\nFormat: ${data.format}\n\nTell me about your event:\n${data.event_details}\nSpeaking budget: ${data.speaking_budget}\n\nLogistics:\n${data.notes || "Not provided"}`;
    error.replaceChildren();
    button.disabled = true;
    button.textContent = "Sending...";
    try {
      await sendSpeakingInquiry(data);
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

  document.addEventListener("invalid", (event) => {
    if (event.target instanceof HTMLSelectElement && event.target.name === "speaking_budget") {
      event.target.setCustomValidity(event.target.value
        ? ""
        : "Please choose a budget range so I can recommend the right format.");
    }
  }, true);

  document.addEventListener("change", (event) => {
    if (event.target instanceof HTMLSelectElement && event.target.name === "speaking_budget") {
      event.target.setCustomValidity("");
    }
  });
})();
