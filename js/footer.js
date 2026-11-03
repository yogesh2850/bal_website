(function () {
  var footer = document.getElementById("site-footer");
  if (!footer) return;

  var year = new Date().getFullYear();
  footer.innerHTML =
    '<div class="wrap">' +
      "<div>" +
        '<p class="brand">Bio-Automation Lab<br><span class="brand-uni">UC Davis</span></p>' +
        "<p>Bio-Automation Lab, Department of Biological and Agricultural Engineering, University of California, Davis.</p>" +
      "</div>" +
      "<div>" +
        "<h2>Contact</h2>" +
        "<ul>" +
          '<li><a href="mailto:svougioukas@ucdavis.edu">svougioukas@ucdavis.edu</a></li>' +
          "<li>3058 Bainer Hall</li>" +
          "<li>Department of Biological and Agricultural Engineering</li>" +
          "<li>One Shields Avenue</li>" +
          "<li>Davis, CA 95616</li>" +
        "</ul>" +
      "</div>" +
      "<div>" +
        "<h2>Links</h2>" +
        "<ul>" +
          '<li><a href="https://scholar.google.com/citations?user=bbeoNpUAAAAJ&amp;hl=en">Google Scholar</a></li>' +
          '<li><a href="https://bae.ucdavis.edu/">Biological and Agricultural Engineering</a></li>' +
          '<li><a href="https://www.ucdavis.edu/">UC Davis</a></li>' +
          '<li><a href="https://github.com/yogesh2850/bal_website">GitHub</a></li>' +
          '<li><a href="contact.html">Join / contact</a></li>' +
        "</ul>" +
      "</div>" +
    "</div>" +
    '<div class="footer-base"><div class="wrap">&copy; ' + year + " Bio-Automation Lab, UC Davis</div></div>";
})();
