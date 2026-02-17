document.addEventListener("DOMContentLoaded", function () {

  // Auto detect path depth
  let pathPrefix = "";

  if (window.location.pathname.includes("/pages/service-details/")) {
    pathPrefix = "../../";
  }
  else if (window.location.pathname.includes("/pages/")) {
    pathPrefix = "../";
  }
  else {
    pathPrefix = "";
  }

  fetch(pathPrefix + "assets/data/navigation.json")
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

      // Logos & Info
      setSrc("companyLogo", pathPrefix + data.logo);
      setText("companyName", data.company);
      setText("companyContact", data.email + " | " + data.phone);

      setSrc("mobileLogo", pathPrefix + data.logo);
      setText("mobileCompanyName", data.company);
      setText("mobileContact", data.email + " | " + data.phone);

      setSrc("mobileTopLogo", pathPrefix + data.logo);
      setText("mobileTopName", data.company);

      // Links
      let desktopLinks = "";
      let mobileLinks = "";

      data.links.forEach(link => {
        desktopLinks += `<li><a href="${pathPrefix + link.url}">${link.name}</a></li>`;
        mobileLinks += `<li><a href="${pathPrefix + link.url}">${link.name}</a></li>`;
      });

      const nav = document.getElementById("navLinks");
      const mobNav = document.getElementById("mobileNavLinks");

      if (nav) nav.innerHTML = desktopLinks;
      if (mobNav) mobNav.innerHTML = mobileLinks;

    })
    .catch(error => console.log("JSON load error:", error));

});

window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
