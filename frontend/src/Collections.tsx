import { Link } from "react-router-dom";
import "./Collections.css";

const collections = [
  {
    title: "MEN",
    description: "Refined essentials. Modern silhouettes.",
    image: "/images/category-men.png",
    link: "/men",
  },
  {
    title: "WOMEN",
    description: "Effortless elegance. Contemporary expression.",
    image: "/images/category-women.png",
    link: "/women",
  },
  {
    title: "ACCESSORIES",
    description: "The details that define your style.",
    image: "/images/category-accessories.png",
    link: "/accessories",
  },
];

export default function Collections() {
  return (
    <main className="collections-page">
      <div className="collections-heading">
        <span>ASCEND STUDIOS / 2026</span>
        <h1>THE COLLECTIONS</h1>
        <p>Discover the art of understated expression.</p>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <Link
            to={collection.link}
            className="collections-card"
            key={collection.title}
          >
            <div className="collections-image">
              <img
                src={collection.image}
                alt={`${collection.title} collection`}
              />
            </div>

            <div className="collections-card-info">
              <div>
                <h2>{collection.title}</h2>
                <p>{collection.description}</p>
              </div>
              <span>EXPLORE ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}