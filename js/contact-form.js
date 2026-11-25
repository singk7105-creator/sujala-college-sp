/* =========================================
    SUJALA_COLLEGE SUCHNA PORTAL
    Contact Form JavaScript MANAGEMENT
========================================= */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxy3F2xMfxgqmjaIIxso9d_AslNfRZ3GTiXXfgSAB1W66yYWjw2go1Ry9EmnjXMbh1h0A/exec";

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const contactSubmit = document.getElementById("contactSubmit");

if (contactForm && contactStatus && contactSubmit) {

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (document.getElementById("website").value.trim() !== "") return;

    if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
      contactStatus.className = "alert alert-warning mt-3 mb-0 d-block";
      contactStatus.textContent = "Please set Google Apps Script URL first.";
      return;
    }

    contactSubmit.disabled = true;
    contactSubmit.innerHTML = 'Sending...';

    const payload = new URLSearchParams({
      name: document.getElementById("name").value.trim(),
      mobile: document.getElementById("mobile").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      website: document.getElementById("website").value.trim()
    });

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: payload
      });

      contactStatus.className = "alert alert-success mt-3 mb-0 d-block";
      contactStatus.textContent = "आपका संदेश सफलतापूर्वक भेज दिया गया है।";
      contactForm.reset();

    } catch (error) {
      console.error("Contact form error:", error);

      contactStatus.className = "alert alert-danger mt-3 mb-0 d-block";
      contactStatus.textContent = "संदेश भेजने में समस्या आई। कृपया पुनः प्रयास करें।";

    } finally {
      contactSubmit.disabled = false;
      contactSubmit.innerHTML = 'Send Message <i class="bi bi-send ms-2"></i>';
    }
  });

}
