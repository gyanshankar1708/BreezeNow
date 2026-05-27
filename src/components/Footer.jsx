export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>BreezeNow</h3>
          <p>Weather, reimagined.</p>
        </div>

        <nav className="footer-links">
          <a href="#weather">Weather</a>
          <a href="#forecast">Forecast</a>
          <a href="#favorites">Favorites</a>
        </nav>

        <p className="footer-copy">
          © {new Date().getFullYear()} BreezeNow
        </p>
      </div>
    </footer>
  );
}