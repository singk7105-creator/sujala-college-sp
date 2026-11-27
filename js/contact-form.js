/* =========================================
    SUJALA_COLLEGE SUCHNA PORTAL
    Contact Form JavaScript MANAGEMENT
========================================= */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxy3F2xMfxgqmjaIIxso9d_AslNfRZ3GTiXXfgSAB1W66yYWjw2go1Ry9EmnjXMbh1h0A/exec";

const MSG_SUCCESS = "आपका संदेश सफलतापूर्वक भेज दिया गया है।";
const MSG_ERROR = "संदेश भेजने में समस्या आई। कृपया पुनः प्रयास करें।";
const MSG_INVALID = "कृपया सभी जरूरी जानकारी सही भरें।";
const MSG_MOBILE = "कृपया सही 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।";
const REQUEST_TIMEOUT_MS = 15000;

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const contactSubmit = document.getElementById("contactSubmit");

function showStatus(type, text) {
  contactStatus.className = `alert alert-${type} mt-3 mb-0 d-block`;
  contactStatus.textContent = text;
}

// Success par Reference Number dikhata hai.
// textContent/DOM se banaya hai, isliye server ka text HTML ki tarah nahi chalta.
function showSuccess(reply) {
  contactStatus.className = "alert alert-success mt-3 mb-0 d-block";
  contactStatus.replaceChildren(document.createTextNode(MSG_SUCCESS));

  // Reference Number sirf tab dikhao jab format sahi ho (jaise SC-2026-00001)
  if (/^[A-Z0-9-]{3,30}$/.test(reply.ref)) {
    const refNumber = document.createElement("strong");
    refNumber.textContent = reply.ref;

    contactStatus.append(
      document.createElement("br"),
      "आपका Reference Number : ",
      refNumber,
      document.createElement("br"),
      "कृपया इसे संभालकर रखें।"
    );
  }

}

// Server ka jawab padhta hai -> { ok, ref }
// Nayi script JSON deti hai: {"result":"success","ref":"SC-2026-00001"}
// Purani script plain text deti thi ("Success" / "Error: ..."), wo bhi sambhalta hai.
// Kuch bhi samajh na aaye (HTML error page, khaali jawab) to fail maana jata hai.
async function readServerReply(response) {
  const failed = { ok: false, ref: "" };

  if (!response.ok) return failed;

  const text = (await response.text()).trim();

  try {
    const data = JSON.parse(text);
    const isSuccess = String(data.result || data.status || "").toLowerCase() === "success";

    return {
      ok: isSuccess,
      ref: String(data.ref || "")
    };
  } catch (e) {
    return /^success$/i.test(text) ? { ok: true, ref: "" } : failed;
  }
}

if (contactForm && contactStatus && contactSubmit) {

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Honeypot: bot ne bhara ho to chupchap ruk jao
    if (document.getElementById("website").value.trim() !== "") return;

    if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
      showStatus("warning", "Please set Google Apps Script URL first.");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validation
    if (!name || !email || !subject || !message ||
        name.length > 100 || email.length > 150 ||
        subject.length > 150 || message.length > 2000) {
      showStatus("warning", MSG_INVALID);
      return;
    }

    if (mobile !== "" && !/^[6-9][0-9]{9}$/.test(mobile)) {
      showStatus("warning", MSG_MOBILE);
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending...";

    const payload = new URLSearchParams({
      name, mobile, email, subject, message,
      website: document.getElementById("website").value.trim()
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: payload,
        signal: controller.signal
      });

      const reply = await readServerReply(response);

      if (reply.ok) {
        showSuccess(reply);
        contactForm.reset();
      } else {
        showStatus("danger", MSG_ERROR);
      }

    } catch (error) {
      console.error("Contact form error:", error);
      showStatus("danger", MSG_ERROR);

    } finally {
      clearTimeout(timer);
      contactSubmit.disabled = false;
      contactSubmit.innerHTML = 'Send Message <i class="bi bi-send ms-2"></i>';
    }
  });

}
