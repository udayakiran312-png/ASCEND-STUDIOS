
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Men.css";

type Category =
  | "All"
  | "Tops"
  | "Shirts"
  | "Dresses"
  | "Trousers"
  | "Outerwear";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
};

const categories: Category[] = [
  "All",
  "Tops",
  "Shirts",
  "Dresses",
  "Trousers",
  "Outerwear",
];

const products: Product[] = [
  {
    id: 101,
    name: "Essential Fitted Tee",
    category: "Tops",
    price: 1299,
    image: "/images/products/women-essential-fitted-tee.png",
  },
  {
    id: 102,
    name: "Relaxed Poplin Shirt",
    category: "Shirts",
    price: 2199,
    image: "/images/products/women-relaxed-poplin-shirt.png",
  },
  {
    id: 103,
    name: "Minimal Slip Dress",
    category: "Dresses",
    price: 2999,
    image: "/images/products/women-minimal-slip-dress.png",
  },
  {
    id: 104,
    name: "Tailored Wide Leg Trouser",
    category: "Trousers",
    price: 2799,
    image: "/images/products/women-tailored-wide-leg-trouser.png",
  },
  {
    id: 105,
    name: "Structured Studio Blazer",
    category: "Outerwear",
    price: 4999,
    image: "/images/products/women-structured-studio-blazer.png",
  },
  {
    id: 106,
    name: "Boxy Cotton Top",
    category: "Tops",
    price: 1499,
    image: "/images/products/women-boxy-cotton-top.png",
  },
  {
    id: 107,
    name: "Classic Midi Dress",
    category: "Dresses",
    price: 3499,
    image: "/images/products/women-classic-midi-dress.png",
  },
  {
    id: 108,
    name: "Minimal Cropped Jacket",
    category: "Outerwear",
    price: 3999,
    image: "/images/products/women-minimal-cropped-jacket.png",
  },

  {
    id: 109,
    name: "Sculpted Ribbed Knit Top",
    category: "Tops",
    price: 2299,
    image: "/images/products/women-sculpted-ribbed-knit-top.png",
  },
  {
    id: 110,
    name: "Draped Satin Shirt",
    category: "Shirts",
    price: 2399,
    image: "/images/products/women-draped-satin-shirt.png",
  },
  {
    id: 111,
    name: "Relaxed Cargo Trouser",
    category: "Trousers",
    price: 2699,
    image: "/images/products/women-relaxed-cargo-trouser.png",
  },
  {
    id: 112,
    name: "Longline Trench Coat",
    category: "Outerwear",
    price: 4799,
    image: "/images/products/women-longline-trench-coat.png",
  },
];

export default function Women() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        activeCategory === "All" ||
        product.category === activeCategory
    );

    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "newest") {
      return [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [activeCategory, sortBy]);

  return (
    <main className="men-page">
      <section className="men-heading">
        <span className="men-eyebrow">
          ASCEND STUDIOS / COLLECTION 002
        </span>

        <h1>WOMEN</h1>

        <div className="men-heading-bottom">
          <p>THE WOMENSWEAR COLLECTION</p>
          <p>REFINED FOR EVERYDAY EXPRESSION.</p>
        </div>
      </section>

      <section className="men-controls">
        <div className="men-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="men-sort">
          <label htmlFor="women-sort">SORT BY</label>

          <select
            id="women-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </section>

      <div className="men-results">
        {filteredProducts.length} PRODUCTS
      </div>

      <section className="men-product-grid">
        {filteredProducts.map((product) => (
          <article className="men-product" key={product.id}>
            <Link
              to={`/women/${product.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="men-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="men-product-info">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </div>

                <span className="men-product-price">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <div className="men-end">
        YOU'VE REACHED THE END OF THE COLLECTION
      </div>
    </main>
  );
}
