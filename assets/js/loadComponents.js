/* =============================
   MOBILE MENU TOGGLE
============================= */

function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  }
}

/* =============================
   AUTO CLOSE ON RESIZE
============================= */

window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) mobileMenu.classList.remove("active");

    document.body.classList.remove("menu-open");

    document.querySelectorAll(".mobile-dropdown").forEach(item => {
      item.classList.remove("active");
    });
  }
});

/* =============================
   PATH DETECTION
============================= */

let pathPrefix = "";
const path = window.location.pathname;

if (path.includes("/pages/service-details/")) {
  pathPrefix = "../../";
} else if (path.includes("/pages/")) {
  pathPrefix = "../";
} else {
  pathPrefix = "";
}

/* =============================
   INSTANT HEADER (No Flicker)
============================= */

document.addEventListener("DOMContentLoaded", function () {

  const logoPath = pathPrefix + "assets/images/DnaLogo.jpeg";
  const companyNameText = "DNA Global Staffing";

  // Set logo instantly
  ["companyLogo", "mobileLogo", "mobileTopLogo"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = logoPath;
  });

  // Set company name instantly
  ["companyName", "mobileCompanyName", "mobileTopName"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = companyNameText;
  });

});

/* =============================
   LOAD NAVIGATION JSON
============================= */

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

    // Clean phone for tel:
    const cleanPhone = data.phone.replace(/\s+/g, "");

    // Desktop (single line)
const desktopContactHTML = `
  <a href="tel:${cleanPhone}">${data.phone}</a> |
  <a href="mailto:${data.email}">${data.email}</a>
`;

// Mobile (2 line clean)
const mobileContactHTML = `
  <div class="mobile-contact-links">
    <a href="tel:${cleanPhone}">${data.phone}</a>
    <a href="mailto:${data.email}">${data.email}</a>
  </div>
`;

    /* SET HEADER DATA */

    setSrc("companyLogo", pathPrefix + data.logo);
    setText("companyName", data.company);
    setSrc("mobileLogo", pathPrefix + data.logo);
    setText("mobileCompanyName", data.company);
    setSrc("mobileTopLogo", pathPrefix + data.logo);
    setText("mobileTopName", data.company);

    const desktopContact = document.getElementById("companyContact");
    const mobileContact = document.getElementById("mobileContact");

    if (desktopContact) desktopContact.innerHTML = desktopContactHTML;
    if (mobileContact) mobileContact.innerHTML = mobileContactHTML;


    /* =============================
   DESKTOP DROPDOWN CLICK FIX
============================= */

document.addEventListener("click", function (e) {

  const toggle = e.target.closest(".dropdown-toggle");
  const dropdown = e.target.closest(".dropdown");

  // If Services button clicked
  if (toggle && dropdown) {
    e.preventDefault();
    dropdown.classList.toggle("active");
    return; 
  }

  // If clicked outside dropdown
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach(item => {
      item.classList.remove("active");
    });
  }

});

/* =============================
   MOBILE DROPDOWN CLICK
============================= */

document.addEventListener("click", function (e) {

  const mobileToggle = e.target.closest(".mobile-toggle");
  const mobileDropdown = mobileToggle?.closest(".mobile-dropdown");

  if (mobileToggle && mobileDropdown) {
    e.preventDefault();
    mobileDropdown.classList.toggle("active");
  }

});


    /* =============================
       BUILD NAV LINKS
    ============================= */

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

        desktopLinks += `
          <li><a href="${pathPrefix + link.url}">${link.name}</a></li>
        `;

        mobileLinks += `
          <li><a href="${pathPrefix + link.url}">${link.name}</a></li>
        `;
      }

    });

    const desktopNav = document.getElementById("navLinks");
    const mobileNav = document.getElementById("mobileNavLinks");

    if (desktopNav) desktopNav.innerHTML = desktopLinks;
    if (mobileNav) mobileNav.innerHTML = mobileLinks;

  })
  .catch(error => console.log("JSON load error:", error));

/* =============================
   CLOSE MOBILE MENU ON OUTSIDE CLICK
============================= */

document.addEventListener("click", function (e) {

  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");

  if (!mobileMenu || !hamburger) return;

  if (mobileMenu.classList.contains("active")) {

    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {

      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");

      document.querySelectorAll(".mobile-dropdown").forEach(item => {
        item.classList.remove("active");
      });

    }
  }
});
