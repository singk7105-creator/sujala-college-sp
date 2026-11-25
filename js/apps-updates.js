/* =========================================
    SUJALA_COLLEGE SUCHNA PORTAL
    Apps & Updates JavaScript MANAGEMENT
========================================= */


// =========================================
//  Apps Loader from apps.json
// =========================================

async function loadApps() {
  const container = document.getElementById("digitalAppsContainer");

  if (!container) {
    console.warn("Apps container not found.");
    return;
  }

  try {
    const res = await fetch('data/apps.json');

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const apps = await res.json();

    if (!Array.isArray(apps)) {
      throw new Error("Invalid apps.json format.");
    }

    container.replaceChildren();

    apps.forEach(app => {
      const column = document.createElement("div");
      column.className = "col-sm-6 col-lg-3";

      const article = document.createElement("article");
      article.className = "app-card";

      const iconBox = document.createElement("div");
      iconBox.className = "app-icon";

      const icon = document.createElement("i");
      icon.className = `bi ${app.icon || ""}`;
      iconBox.appendChild(icon);

      const title = document.createElement("h3");
      title.textContent = app.title || "";

      const description = document.createElement("p");
      description.textContent = app.description || "";

      const link = document.createElement("a");
      link.className = "app-link";
      link.href = app.link || "#";
      link.textContent = "View Details ";

      const arrow = document.createElement("i");
      arrow.className = "bi bi-arrow-right";
      link.appendChild(arrow);

      article.append(iconBox, title, description, link);
      column.appendChild(article);
      container.appendChild(column);
    });

  } catch (err) {
    console.error("Apps load error:", err);
  }
}


// =========================================
//  Updates Loader from updates.json
// =========================================

let quickUpdates = [];
let showAllUpdates = false;

async function loadUpdates() {
  try {
    const res = await fetch('./data/updates.json');

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    quickUpdates = await res.json();

    if (!Array.isArray(quickUpdates)) {
      throw new Error("Invalid updates.json format.");
    }

    renderUpdates();

  } catch (err) {
    console.error("Updates load error:", err);
  }
}

function renderUpdates() {
  const container = document.getElementById("quickUpdatesList");
  const btn = document.getElementById("showAllUpdates");

  if (!container) {
    console.error("Updates container not found.");
    return;
  }

  const visible = showAllUpdates ? quickUpdates : quickUpdates.slice(0, 3);

  container.innerHTML = visible.map(item => `
      <div class="col-md-4">
        <article class="notice-card h-100">
          <span class="notice-label">${item.category}</span><br>
          <span class="notice-date">${item.date}</span>
          <h3><i class="bi ${item.icon || "bi-bell"} me-1"></i>${item.title}</h3>
          <p>${item.description}</p>
          <a href="${item.link}" class="app-link d-inline-block mt-3">Read More <i class="bi bi-arrow-right"></i></a>
        </article>
      </div>
    `).join("");

  if (btn) {
    btn.hidden = quickUpdates.length <= 3;
    btn.innerHTML = showAllUpdates
      ? 'Show Less <i class="bi bi-arrow-up ms-1"></i>'
      : 'Show All Updates <i class="bi bi-arrow-right ms-1"></i>';
  }
}

const showAllBtn = document.getElementById("showAllUpdates");

if (showAllBtn) {
  showAllBtn.addEventListener("click", () => {
    showAllUpdates = !showAllUpdates;
    renderUpdates();
  });
}


// =========================================
//  Initialize
// =========================================

loadApps();
loadUpdates();
