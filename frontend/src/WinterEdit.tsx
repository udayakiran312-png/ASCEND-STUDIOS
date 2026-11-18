
import "./WinterEdit.css";

export default function WinterEdit() {
  return (
    <section className="winter-edit">
      <div className="winter-edit-visual">
        <img
          src="/images/winter-edit.png"
          alt="ASCEND STUDIOS winter collection"
        />
      </div>

      <div className="winter-edit-content">
        <span className="winter-edit-label">
          NEW SEASON
        </span>

        <h2>
          WINTER
          <br />
          EDIT
        </h2>

        <p>
          Tailored layers. Timeless style.
          <br />
          The new season is here.
        </p>

        <a href="/collections" className="winter-edit-button">
          EXPLORE COLLECTION
        </a>
      </div>
    </section>
  );
}
