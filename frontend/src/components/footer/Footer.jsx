import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <p>
        &copy; {new Date().getFullYear()} <strong>Bookly</strong> — Made by{" "}
        <a
          href="https://saadaouimahmoud.netlify.app"
          target="_blank"
          rel="noreferrer"
        >
          Mahmoud Saadaoui
        </a>
      </p>
    </footer>
  );
}

export default Footer;
