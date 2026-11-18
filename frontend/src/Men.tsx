
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Men.css";

type Category =
  | "All"
  | "T-Shirts"
  | "Shirts"
  | "Trousers"
  | "Outerwear";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  image?: string;
};

const categories: Category[] = [
  "All",
  "T-Shirts",
  "Shirts",
  "Trousers",
  "Outerwear",
];

const products: Product[] = [
  {
    id: 1,
    name: "Essential Heavyweight Tee",
    category: "T-Shirts",
    price: 1299,
    image: "/images/products/men-heavyweight-black.png",
  },
  {
    id: 2,
    name: "Studio Overshirt",
    category: "Shirts",
    price: 2499,
    image: "/images/products/men-overshirt-stone.png",
  },
  {
    id: 3,
    name: "Relaxed Pleated Trouser",
    category: "Trousers",
    price: 2799,
    image: "/images/products/men-pleated-trouser-black.png",
  },
  {
    id: 4,
    name: "Structured Wool Jacket",
    category: "Outerwear",
    price: 4999,
    image: "/images/products/men-wool-jacket-black.png",
  },
  {
    id: 5,
    name: "Boxy Cotton Tee",
    category: "T-Shirts",
    price: 1499,
    image: "/images/products/men-boxy-cotton-tee.png",
  },
  {
    id: 6,
    name: "Classic Poplin Shirt",
    category: "Shirts",
    price: 2199,
    image: "/images/products/men-classic-poplin-white.png",
  },
  {
    id: 7,
    name: "Wide Leg Trouser",
    category: "Trousers",
    price: 2999,
    image: "/images/products/men-wide-leg-trouser-ivory.png",
  },
  {
    id: 8,
    name: "Minimal Zip Jacket",
    category: "Outerwear",
    price: 3999,
    image: "/images/products/men-minimal-zip-jacket-black.png",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Men() {
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState("featured");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        category === "All" || product.category === category
    );

    if (sort === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      return [...filtered].sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [category, sort]);

  return (
    <main className="men-page">
      <div className="men-heading">
        <div className="men-eyebrow">
          ASCEND STUDIOS / COLLECTION 2026
        </div>

        <h1>MEN</h1>

        <div className="men-heading-bottom">
          <p>THE MENSWEAR COLLECTION</p>
          <span>DESIGNED FOR EVERYDAY EXPRESSION.</span>
        </div>
      </div>

      <div className="men-controls">
        <div
          className="men-categories"
          aria-label="Product categories"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="men-sort">
          <label htmlFor="men-sort-select">SORT BY</label>

          <select
            id="men-sort-select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">FEATURED</option>
            <option value="newest">NEWEST</option>
            <option value="price-low">
              PRICE: LOW TO HIGH
            </option>
            <option value="price-high">
              PRICE: HIGH TO LOW
            </option>
          </select>
        </div>
      </div>

      <div className="men-results">
        {visibleProducts.length} PRODUCTS
      </div>

      <div className="men-product-grid">
        {visibleProducts.map((product) => (
          <article className="men-product" key={product.id}>
            <Link
              to={`/men/${product.id}`}
              className="men-product-link"
              style={{
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="men-product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <span>ASCEND STUDIOS</span>
                )}
              </div>

              <div className="men-product-info">
                <div>
                  <h2>{product.name}</h2>
                  <p>{product.category.toUpperCase()}</p>
                </div>

                <span className="men-product-price">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="men-end">
        ASCEND STUDIOS — COLLECTION 2026
      </div>
    </main>
  );
}
