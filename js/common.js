/* =========================================
    SUJALA_COLLEGE SUCHNA PORTAL
    Common File for JavaScript MANAGEMENT
========================================= */


// =========================================
//  Current Year Script
// =========================================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// =========================================
//  Back to Top Button Script
// =========================================

const backTop = document.getElementById("backTop");

if (backTop) {
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 450);
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


// =========================================
//  Header Loader from header.json
// =========================================

async function loadHeader() {
  try {
    const navbar = document.getElementById("mainNavbar");

    if (!navbar) {
      console.warn("Header element #mainNavbar not found");
      return;
    }

    const res = await fetch('data/header.json');

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.navLinks)) {
      throw new Error("Invalid navLinks data");
    }

    navbar.innerHTML = `
      <div class="container">
        <a class="navbar-brand" href="index.html">
          <img src="${data.logo}" alt="">
          <span>
            <span class="brand-name">${data.brandName}</span>
            <br>
            <span class="brand-sub">${data.brandSub}</span>
          </span>
        </a>

        <button class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-label="Toggle navigation"
          aria-controls="mainNav"
          aria-expanded="false">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            ${data.navLinks.map(nav =>
              `<li class="nav-item">
                <a class="nav-link" href="${nav.link}">${nav.title}</a>
              </li>`
            ).join("")}

            <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
              <a class="btn btn-brand btn-sm" href="index.html#apps">
                Explore Portal
                <i class="bi bi-arrow-up-right ms-1"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;

  } catch (err) {
    console.error("Header load error:", err);
  }
}


// =========================================
//  Footer Loader from footer.json
// =========================================

async function loadFooter() {
  try {
    const res = await fetch('data/footer.json');

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    document.getElementById("footerQuickLinks").innerHTML = data.quickLinks
      .map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join("");

    document.getElementById("footerUsefulSections").innerHTML = data.usefulSections
      .map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join("");

  } catch (err) {
    console.error("Footer load error:", err);
  }
}

// =========================================
//  Initialize
// =========================================

loadHeader();
loadFooter();
