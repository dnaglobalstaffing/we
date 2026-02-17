/* =============================
   MOBILE MENU TOGGLE
============================= */

function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("active");
  }
}

/* =============================
   AUTO CLOSE MOBILE MENU 
   WHEN SCREEN RESIZE TO DESKTOP
============================= */

window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    // Also close any open mobile dropdown
    document.querySelectorAll(".mobile-dropdown").forEach(item => {
      item.classList.remove("active");
    });
  }
});


/* =============================
   AUTO PATH DETECTION
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
   LOAD NAVIGATION JSON
============================= */

fetch(pathPrefix + "data/navigation.json")
  .then(res => {
    if (!res.ok) throw new Error("Navigation JSON not found");
    return res.json();
  })
  .then(data => {

    /* =============================
       SET COMPANY INFO
    ============================= */

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    const setSrc = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.src = value;
    };

    setSrc("companyLogo", pathPrefix + data.logo);
    setText("companyName", data.company);
    setText("companyContact", data.email + " | " + data.phone);

    setSrc("mobileLogo", pathPrefix + data.logo);
    setText("mobileCompanyName", data.company);
    setText("mobileContact", data.email + " | " + data.phone);

    setSrc("mobileTopLogo", pathPrefix + data.logo);
    setText("mobileTopName", data.company);


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


    /* =============================
       DESKTOP DROPDOWN CLICK
    ============================= */

    document.addEventListener("click", function (e) {

      // Desktop
      const toggle = e.target.closest(".dropdown-toggle");
      const dropdown = e.target.closest(".dropdown");

      if (toggle) {
        e.preventDefault();
        dropdown.classList.toggle("active");
      } else {
        document.querySelectorAll(".dropdown").forEach(item => {
          if (!item.contains(e.target)) {
            item.classList.remove("active");
          }
        });
      }

      // Mobile
      const mobileToggle = e.target.closest(".mobile-toggle");
      const mobileDropdown = mobileToggle?.closest(".mobile-dropdown");

      if (mobileToggle && mobileDropdown) {
        e.preventDefault();
        mobileDropdown.classList.toggle("active");
      }

    });

  })
  .catch(error => console.log("JSON load error:", error));

  
  /* ==============================
   AUTO CLOSE MOBILE MENU
   WHEN RESIZE TO DESKTOP
============================== */

window.addEventListener("resize", function () {

  if (window.innerWidth > 768) {

    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    document.body.classList.remove("menu-open");
  }

});

// =============================
// FOOTER LOAD
// =============================

fetch(pathPrefix + "data/footer.json")
  .then(res => {
    if (!res.ok) throw new Error("Footer JSON not found");
    return res.json();
  })
  .then(data => {

    let footerHTML = `

      <div class="footer-col">
        <h2>${data.company}</h2>
        <p>${data.description}</p>
      </div>

      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul>
          ${data.quickLinks.map(link =>
            `<li><a href="${pathPrefix + link.url}">${link.name}</a></li>`
          ).join("")}
        </ul>
      </div>

      <div class="footer-col">
        <h3>Services</h3>
        <ul>
          ${data.services.map(service =>
            `<li>${service}</li>`
          ).join("")}
        </ul>
      </div>

      <div class="footer-col">
        <h3>Contact</h3>
        <p>📍 ${data.contact.location}</p>
        <p>📞 ${data.contact.phone}</p>
        <p>📧 ${data.contact.email}</p>
      </div>

    `;

    document.getElementById("footerContent").innerHTML = footerHTML;
    document.getElementById("footerBottom").textContent = data.copyright;

  })
  .catch(err => console.log("Footer JSON error:", err));
