function toggleMenu() {
  document.getElementById("mobileMenu")?.classList.toggle("active");
}

let pathPrefix = "";

// Auto detect folder depth
const path = window.location.pathname;

if (path.includes("/pages/service-details/")) {
  pathPrefix = "../../";
} 
else if (path.includes("/pages/")) {
  pathPrefix = "../";
} 
else {
  pathPrefix = "";
}

fetch(pathPrefix + "data/navigation.json")
  .then(res => {
    if (!res.ok) throw new Error("Navigation JSON not found");
    return res.json();
  })
  .then(data => {

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    const setSrc = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.src = value;
    };

    // =============================
// DESKTOP DROPDOWN CLICK LOGIC
// =============================

document.addEventListener("click", function (e) {

  const toggle = e.target.closest(".dropdown-toggle");
  const dropdown = document.querySelector(".dropdown");

  if (!dropdown) return;

  // If Services clicked
  if (toggle) {
    e.preventDefault();
    dropdown.classList.toggle("active");
  }
  // Click outside close
  else if (!e.target.closest(".dropdown")) {
    dropdown.classList.remove("active");
  }

});


// =============================
// MOBILE DROPDOWN CLICK LOGIC
// =============================

document.addEventListener("click", function (e) {

  const mobileToggle = e.target.closest(".mobile-toggle");
  const mobileDropdown = mobileToggle?.closest(".mobile-dropdown");

  if (mobileToggle && mobileDropdown) {
    e.preventDefault();
    mobileDropdown.classList.toggle("active");
  }

});


    setSrc("companyLogo", pathPrefix + data.logo);
    setText("companyName", data.company);
    setText("companyContact", data.email + " | " + data.phone);

    setSrc("mobileLogo", pathPrefix + data.logo);
    setText("mobileCompanyName", data.company);
    setText("mobileContact", data.email + " | " + data.phone);

    setSrc("mobileTopLogo", pathPrefix + data.logo);
    setText("mobileTopName", data.company);

    let desktopLinks = "";
    let mobileLinks = "";

    data.links.forEach(link => {

  if (link.dropdown) {

    desktopLinks += `
      <li class="dropdown">
        <a href="javascript:void(0)" class="dropdown-toggle">
          ${link.name} ▼
        </a>
        <ul class="dropdown-menu">
          ${link.dropdown.map(sub =>
            `<li><a href="${pathPrefix + sub.url}">${sub.name}</a></li>`
          ).join("")}
        </ul>
      </li>
    `;

    mobileLinks += `
      <li class="mobile-dropdown">
        <a href="javascript:void(0)" class="mobile-toggle">
          ${link.name} ▼
        </a>
        <ul class="mobile-submenu">
          ${link.dropdown.map(sub =>
            `<li><a href="${pathPrefix + sub.url}">${sub.name}</a></li>`
          ).join("")}
        </ul>
      </li>
    `;

  } else {
    desktopLinks += `<li><a href="${pathPrefix + link.url}">${link.name}</a></li>`;
    mobileLinks += `<li><a href="${pathPrefix + link.url}">${link.name}</a></li>`;
  }

});


    document.getElementById("navLinks").innerHTML = desktopLinks;
    document.getElementById("mobileNavLinks").innerHTML = mobileLinks;

  })
  .catch(error => console.log("JSON load error:", error));
