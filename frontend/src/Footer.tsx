
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ascend-footer">
      <div className="footer-wordmark" aria-label="ASCEND STUDIOS">
        <span className="footer-ascend">ASCEND</span>
        <span className="footer-studios">STUDIOS</span>
      </div>

      <div className="footer-about">
        <h2>ABOUT US</h2>
        <p>
          ASCEND STUDIOS is a contemporary fashion label focused
          on refined essentials, timeless silhouettes, and
          understated expression.
        </p>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ASCEND STUDIOS</span>
        <span>DESIGNED TO ASCEND.</span>
      </div>
    </footer>
  );
}
