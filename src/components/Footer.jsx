const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h2>BreezeNow</h2>
        <p>Weather, reimagined.</p>
      </div>

      <div className="footer-links">
        <a href="#weather">Weather</a>
        <a href="#forecast">Forecast</a>
        <a href="#favorites">Favorites</a>
      </div>

      <p className="footer-description">
        Built for a calmer weather experience.
      </p>

      <div className="footer-bottom">
        © 2025 BreezeNow
      </div>
    </footer>
  );
};

export default Footer;