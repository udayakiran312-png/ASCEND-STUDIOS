
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import "./Search.css";

const products = [
  { id: 1, name: "Essential Heavyweight Tee", category: "T-Shirts", price: 1299, image: "/images/products/men-heavyweight-black.png" },
  { id: 2, name: "Studio Overshirt", category: "Shirts", price: 2499, image: "/images/products/men-overshirt-stone.png" },
  { id: 3, name: "Relaxed Pleated Trouser", category: "Trousers", price: 2799, image: "/images/products/men-pleated-trouser-black.png" },
  { id: 4, name: "Structured Wool Jacket", category: "Outerwear", price: 4999, image: "/images/products/men-wool-jacket-black.png" },
  { id: 5, name: "Boxy Cotton Tee", category: "T-Shirts", price: 1499, image: "/images/products/men-boxy-cotton-tee.png" },
  { id: 6, name: "Classic Poplin Shirt", category: "Shirts", price: 2199, image: "/images/products/men-classic-poplin-white.png" },
  { id: 7, name: "Wide Leg Trouser", category: "Trousers", price: 2999, image: "/images/products/men-wide-leg-trouser-ivory.png" },
  { id: 8, name: "Minimal Zip Jacket", category: "Outerwear", price: 3999, image: "/images/products/men-minimal-zip-jacket-black.png" },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [input, setInput] = useState(query);

  const filtered = products.filter((product) =>
    `${product.name} ${product.category} men`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    setParams(value ? { q: value } : {});
  }

  return (
    <main className="ascend-search-page">
      <header className="ascend-search-heading">
        <span>ASCEND STUDIOS / DISCOVER</span>
        <h1>SEARCH</h1>
        <p>FIND YOUR NEXT ESSENTIAL.</p>
      </header>

      <form className="ascend-search-form" onSubmit={submit}>
        <SearchIcon size={23} strokeWidth={1.4} />
        <input
          autoFocus
          value={input}
          onChange={(event) => {
            const value = event.target.value;
            setInput(value);
            setParams(value.trim() ? { q: value } : {}, { replace: true });
          }}
          placeholder="SEARCH PRODUCTS..."
          aria-label="Search products"
        />
        {input && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setInput("");
              setParams({}, { replace: true });
            }}
          >
            <X size={20} />
          </button>
        )}
        <button type="submit" className="ascend-search-submit">
          SEARCH <ArrowRight size={16} />
        </button>
      </form>

      <div className="ascend-search-results-heading">
        <span>
          {query ? `RESULTS FOR "${query.toUpperCase()}"` : "EXPLORE ALL PRODUCTS"}
        </span>
        <span>
          {filtered.length} {filtered.length === 1 ? "PRODUCT" : "PRODUCTS"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <section className="ascend-search-empty">
          <SearchIcon size={36} strokeWidth={1.1} />
          <h2>NO MATCHES FOUND.</h2>
          <p>Try a different search or explore the collection.</p>
          <Link to="/men">SHOP MEN <ArrowRight size={16} /></Link>
        </section>
      ) : (
        <div className="ascend-search-grid">
          {filtered.map((product) => (
            <Link
              to={`/men/${product.id}`}
              key={product.id}
              className="ascend-search-product"
            >
              <div className="ascend-search-image">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="ascend-search-product-info">
                <div>
                  <h2>{product.name}</h2>
                  <p>MEN / {product.category.toUpperCase()}</p>
                </div>
                <strong>{formatPrice(product.price)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
