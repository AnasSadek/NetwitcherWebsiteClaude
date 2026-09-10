/**
 * Inquiry flow (components/contact/InquiryFlow.tsx), vanilla port.
 *
 * The three step panels are rendered by templates/page-kontakt.php; this
 * module owns the state: current step, chosen topic, timing, the step
 * transition (AnimatePresence mode="wait": exit 0.22s → enter 0.22s, none
 * with reduced motion), focus on the new step's heading, per-step native
 * validation and the hand-off. There is no backend: the answers are joined
 * into one message and opened as mailto: or as a wa.me link.
 */
const root = document.querySelector("[data-inquiry]");
if (root) init(root);

function init(root) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const form = root.querySelector("[data-inquiry-form]");
  const panels = [...root.querySelectorAll("[data-step-panel]")];
  const bars = [...root.querySelectorAll("[data-bar]")];
  const progress = root.querySelector("[data-progress]");
  const topicName = root.querySelector("[data-topic-name]");
  const topicArrow = topicName.parentElement.querySelector("path");
  const sentBox = root.querySelector("[data-sent]");
  const sentText = root.querySelector("[data-sent-text]");
  const email = root.dataset.email;
  const whatsapp = root.dataset.whatsapp;
  const STEP_LABELS = ["Thema", "Vorhaben", "Kontakt"];
  const DURATION = 220;

  let step = Number(root.dataset.step) || 0;
  let busy = false;
  const topicButtons = [...root.querySelectorAll("[data-topic-id]")];
  let topic = topicButtons.find((b) => b.dataset.topicId === root.dataset.topic) || null;

  const field = (name) => form.elements[name];
  const timingLabel = () => {
    const r = form.querySelector('input[name="timing"]:checked');
    return r ? r.dataset.timingLabel : "offen";
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const renderProgress = () => {
    progress.textContent = `Schritt ${step + 1} von 3: ${STEP_LABELS[step]}`;
    bars.forEach((b, i) => {
      b.classList.toggle("bg-mint", i <= step);
      b.classList.toggle("bg-ink/10", i > step);
    });
  };

  /** Step change with the Framer transition: exit (x → -16) then enter (x from 16). */
  const go = async (next) => {
    if (busy || next === step) return;
    busy = true;
    const cur = panels[step];
    const nxt = panels[next];
    if (!reduce) {
      cur.classList.add("is-exit");
      await wait(DURATION);
    }
    cur.hidden = true;
    cur.classList.remove("is-exit");
    step = next;
    renderProgress();
    if (!reduce) nxt.classList.add("is-enter");
    nxt.hidden = false;
    if (!reduce) {
      void nxt.offsetWidth; // commit the enter state before transitioning to center
      nxt.classList.remove("is-enter");
    }
    // React: focus once the new heading is mounted (never on first render).
    nxt.querySelector("[data-step-heading]").focus({ preventScroll: false });
    busy = false;
  };

  /** form.reportValidity() limited to the controls of the visible step. */
  const validStep = () => {
    for (const el of panels[step].querySelectorAll("input, textarea")) {
      if (!el.reportValidity()) return false;
    }
    return true;
  };

  const buildMessage = () => {
    const lines = [
      `Thema: ${topic ? topic.dataset.topicLabel : "-"}`,
      `Zeitrahmen: ${timingLabel()}`,
      "",
      field("message").value,
      "",
      `Name: ${field("name").value}`,
      `E-Mail: ${field("email").value}`,
    ];
    if (field("company").value) lines.push(`Unternehmen: ${field("company").value}`);
    if (field("phone").value) lines.push(`Telefon: ${field("phone").value}`);
    return lines.join("\n");
  };

  const setSent = (kind) => {
    sentText.textContent =
      kind === "mail"
        ? "Dein E-Mail-Programm öffnet sich mit der fertigen Anfrage, einmal absenden, dann ist sie bei uns."
        : "WhatsApp öffnet sich mit der fertigen Nachricht, einmal absenden, dann ist sie bei uns.";
    sentBox.hidden = false;
  };

  // Step 1: choose a topic
  for (const b of topicButtons) {
    b.addEventListener("click", () => {
      topic = b;
      topicName.textContent = b.dataset.topicLabel;
      topicArrow.setAttribute("fill", b.dataset.topicColor);
      go(1);
    });
  }

  // Step 2: timing chips (controlled label classes), "Weiter", back links
  const chips = [...root.querySelectorAll("[data-timing]")];
  const on = ["border-mint", "bg-mint/10", "text-ink"];
  const off = ["border-ink/10", "text-ink-3", "hover:border-ink/35"];
  for (const chip of chips) {
    chip.querySelector("input").addEventListener("change", () => {
      for (const c of chips) {
        const checked = c.querySelector("input").checked;
        c.classList.remove(...(checked ? off : on));
        c.classList.add(...(checked ? on : off));
      }
    });
  }
  root.querySelector("[data-next]").addEventListener("click", () => {
    if (!validStep()) return;
    go(2);
  });
  for (const b of root.querySelectorAll("[data-go]")) {
    b.addEventListener("click", () => go(Number(b.dataset.go)));
  }

  // Step 3: submit → mailto (native validation first, like the original form submit)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validStep()) return;
    const subject = `Anfrage: ${topic ? topic.dataset.topicLabel : "Allgemein"}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
    setSent("mail");
  });
  root.querySelector("[data-whatsapp-submit]").addEventListener("click", () => {
    if (!validStep()) return;
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hallo Netwitcher!\n\n${buildMessage()}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSent("whatsapp");
  });
}
