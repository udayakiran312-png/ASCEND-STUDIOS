
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Men.css";

type Gender = "All" | "Men" | "Women";

type Category =
  | "All"
  | "Bags"
  | "Leather Goods"
  | "Eyewear"
  | "Headwear"
  | "Jewellery"
  | "Watches"
  | "Scarves";

type Product = {
  id: number;
  name: string;
  gender: "Men" | "Women" | "Unisex";
  category: Exclude<Category, "All">;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 201,
    name: "Minimal Leather Wallet",
    gender: "Men",
    category: "Leather Goods",
    price: 1499,
    image: "/images/products/accessory-wallet.png",
  },
  {
    id: 202,
    name: "Essential Leather Belt",
    gender: "Men",
    category: "Leather Goods",
    price: 1299,
    image: "/images/products/accessory-belt.png",
  },
  {
    id: 203,
    name: "Minimal Black Sunglasses",
    gender: "Unisex",
    category: "Eyewear",
    price: 1799,
    image: "/images/products/accessory-sunglasses.png",
  },
  {
    id: 204,
    name: "Studio Baseball Cap",
    gender: "Unisex",
    category: "Headwear",
    price: 899,
    image: "/images/products/accessory-cap.png",
  },
  {
    id: 205,
    name: "Minimal Leather Tote",
    gender: "Women",
    category: "Bags",
    price: 2999,
    image: "/images/products/accessory-tote.png",
  },
  {
    id: 206,
    name: "Classic Crossbody Bag",
    gender: "Unisex",
    category: "Bags",
    price: 2499,
    image: "/images/products/accessory-crossbody.png",
  },
  {
    id: 207,
    name: "Studio Silver Bracelet",
    gender: "Unisex",
    category: "Jewellery",
    price: 1199,
    image: "/images/products/accessory-bracelet.png",
  },
  {
    id: 208,
    name: "Classic Silver Necklace",
    gender: "Unisex",
    category: "Jewellery",
    price: 1199,
    image: "/images/products/accessory-necklace.png",
  },
  {
    id: 209,
    name: "Minimal Steel Watch",
    gender: "Unisex",
    category: "Watches",
    price: 3999,
    image: "/images/products/accessory-minimal-steel-watch.png",
  },
  {
    id: 210,
    name: "Silk Paisley Bandana",
    gender: "Unisex",
    category: "Scarves",
    price: 1499,
    image: "/images/products/accessory-silk-paisley-bandana.png",
  },
  {
    id: 211,
    name: "Sculpted Silver Ring",
    gender: "Unisex",
    category: "Jewellery",
    price: 1899,
    image: "/images/products/accessory-sculpted-silver-ring.png",
  },
  {
    id: 212,
    name: "Minimal Leather Cardholder",
    gender: "Unisex",
    category: "Leather Goods",
    price: 1299,
    image: "/images/products/accessory-minimal-leather-cardholder.png",
  },
];

const genders: Gender[] = ["All", "Men", "Women"];

const categories: Category[] = [
  "All",
  "Bags",
  "Leather Goods",
  "Eyewear",
  "Headwear",
  "Jewellery",
  "Watches",
  "Scarves",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Accessories() {
  const [gender, setGender] = useState<Gender>("All");
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState("featured");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesGender =
        gender === "All" ||
        product.gender === gender ||
        product.gender === "Unisex";

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesGender && matchesCategory;
    });

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
  }, [gender, category, sort]);

  return (
    <main className="men-page accessories-page">
      <div className="men-heading">
        <div className="men-eyebrow">
          ASCEND STUDIOS / COLLECTION 003
        </div>

        <h1>ACCESSORIES</h1>

        <div className="men-heading-bottom">
          <p>THE ACCESSORIES COLLECTION</p>
          <span>THE DETAILS DEFINE THE LOOK.</span>
        </div>
      </div>

      <div className="men-controls">
        <div
          className="men-categories"
          aria-label="Shop by gender"
        >
          {genders.map((item) => (
            <button
              key={item}
              type="button"
              className={gender === item ? "active" : ""}
              onClick={() => setGender(item)}
              aria-pressed={gender === item}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="men-sort">
          <label htmlFor="accessories-sort">
            SORT BY
          </label>

          <select
            id="accessories-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
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

      <div className="men-controls">
        <div
          className="men-categories"
          aria-label="Accessory categories"
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
      </div>

      <div className="men-results">
        {visibleProducts.length} PRODUCTS
      </div>

      <div className="men-product-grid">
        {visibleProducts.map((product) => (
          <article
            className="men-product"
            key={product.id}
          >
            <Link
              to={`/accessories/${product.id}`}
              className="men-product-link"
              style={{
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="men-product-image accessories-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="men-product-info">
                <div>
                  <h2>{product.name}</h2>
                  <p>
                    {product.category.toUpperCase()}
                  </p>
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
