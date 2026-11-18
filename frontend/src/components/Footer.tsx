
import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  footer: {
    width: "100%",
    background: "#f5f3f0",
    color: "#202020",
    borderTop: "1px solid #dedbd7",
    padding: "22px 3% 16px",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  container: {
    maxWidth: "1600px",
    margin: "0 auto",
  },

  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px 40px",
    paddingBottom: "20px",
    borderBottom: "1px solid #d8d5d1",
  },

  brand: {
    display: "flex",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: "12px",
  },

  ascend: {
    fontSize: "clamp(42px, 5.5vw, 85px)",
    fontWeight: 900,
    letterSpacing: "-0.075em",
    lineHeight: 1,
    margin: 0,
  },

  studios: {
    fontSize: "clamp(16px, 2vw, 30px)",
    fontWeight: 300,
    letterSpacing: "0.16em",
    lineHeight: 1,
    margin: 0,
  },

  about: {
    maxWidth: "420px",
  },

  aboutTitle: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.25em",
    margin: "0 0 8px",
  },

  aboutText: {
    fontSize: "12px",
    lineHeight: 1.6,
    color: "#66615e",
    margin: 0,
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    paddingTop: "15px",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.12em",
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.main}>
          <div style={styles.brand}>
            <h2 style={styles.ascend}>
              ASCEND
            </h2>

            <span style={styles.studios}>
              STUDIOS
            </span>
          </div>

          <div style={styles.about}>
            <h3 style={styles.aboutTitle}>
              ABOUT US
            </h3>

            <p style={styles.aboutText}>
              ASCEND STUDIOS is a contemporary fashion
              label focused on refined essentials,
              timeless silhouettes, and understated
              expression.
            </p>
          </div>
        </div>

        <div style={styles.bottom}>
          <span>© 2026 ASCEND STUDIOS</span>
          <span>DESIGNED TO ASCEND.</span>
        </div>
      </div>
    </footer>
  );
}
