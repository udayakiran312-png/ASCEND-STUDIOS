
import { ArrowRight } from "lucide-react";
import "./CategoryStrip.css";

const categories = [
  {
    title: "MEN",
    description: "Elevated essentials\nfor modern living.",
    image: "/images/category-men.png",
    link: "/men",
    action: "SHOP MEN",
  },
  {
    title: "WOMEN",
    description: "Effortless style\nfor every you.",
    image: "/images/category-women.png",
    link: "/women",
    action: "SHOP WOMEN",
  },
  {
    title: "ACCESSORIES",
    description: "Refined details\nfor a complete look.",
    image: "/images/category-accessories.png",
    link: "/accessories",
    action: "SHOP ACCESSORIES",
  },
];

export default function CategoryStrip() {
  return (
    <section className="category-strip">
      <div className="category-strip-inner">
        {categories.map((category) => (
          <article
            className="category-item"
            key={category.title}
          >
            <a
              href={category.link}
              className="category-image-link"
            >
              <img
                src={category.image}
                alt={`${category.title} collection`}
              />
            </a>

            <div className="category-content">
              <h2>{category.title}</h2>

              <p>{category.description}</p>

              <a
                href={category.link}
                className="category-shop-link"
              >
                {category.action}
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
