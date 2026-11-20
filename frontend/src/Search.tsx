
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
  { id: 9, name: "Essential Grey Baggy Sweatpants", category: "Trousers", price: 1899, image: "/images/products/men-grey-baggy-sweatpants.png" },
  { id: 10, name: "Relaxed Linen Shirt", category: "Shirts", price: 2399, image: "/images/products/men-relaxed-linen-shirt.png" },
  { id: 11, name: "Charcoal Knit Polo", category: "Shirts", price: 2299, image: "/images/products/men-charcoal-knit-polo.png" },
  { id: 12, name: "Midnight Quarter-Zip Knit", category: "Shirts", price: 2699, image: "/images/products/men-midnight-quarter-zip.png" },

  { id: 101, name: "Essential Fitted Tee", category: "Tops", price: 1299, image: "/images/products/women-essential-fitted-tee.png" },
  { id: 102, name: "Relaxed Poplin Shirt", category: "Shirts", price: 2199, image: "/images/products/women-relaxed-poplin-shirt.png" },
  { id: 103, name: "Minimal Slip Dress", category: "Dresses", price: 2999, image: "/images/products/women-minimal-slip-dress.png" },
  { id: 104, name: "Tailored Wide Leg Trouser", category: "Trousers", price: 2799, image: "/images/products/women-tailored-wide-leg-trouser.png" },
  { id: 105, name: "Structured Studio Blazer", category: "Outerwear", price: 4999, image: "/images/products/women-structured-studio-blazer.png" },
  { id: 106, name: "Boxy Cotton Top", category: "Tops", price: 1499, image: "/images/products/women-boxy-cotton-top.png" },
  { id: 107, name: "Classic Midi Dress", category: "Dresses", price: 3499, image: "/images/products/women-classic-midi-dress.png" },
  { id: 108, name: "Minimal Cropped Jacket", category: "Outerwear", price: 3999, image: "/images/products/women-minimal-cropped-jacket.png" },
  { id: 109, name: "Sculpted Ribbed Knit Top", category: "Tops", price: 2299, image: "/images/products/women-sculpted-ribbed-knit-top.png" },
  { id: 110, name: "Draped Satin Shirt", category: "Shirts", price: 2399, image: "/images/products/women-draped-satin-shirt.png" },
  { id: 111, name: "Relaxed Cargo Trouser", category: "Trousers", price: 2699, image: "/images/products/women-relaxed-cargo-trouser.png" },
  { id: 112, name: "Longline Trench Coat", category: "Outerwear", price: 4799, image: "/images/products/women-longline-trench-coat.png" },

  { id: 201, name: "Minimal Leather Wallet", category: "Leather Goods", price: 1499, image: "/images/products/accessory-wallet.png" },
  { id: 202, name: "Essential Leather Belt", category: "Leather Goods", price: 1299, image: "/images/products/accessory-belt.png" },
  { id: 203, name: "Minimal Black Sunglasses", category: "Eyewear", price: 1799, image: "/images/products/accessory-sunglasses.png" },
  { id: 204, name: "Studio Baseball Cap", category: "Headwear", price: 899, image: "/images/products/accessory-cap.png" },
  { id: 205, name: "Minimal Leather Tote", category: "Bags", price: 2999, image: "/images/products/accessory-tote.png" },
  { id: 206, name: "Classic Crossbody Bag", category: "Bags", price: 2499, image: "/images/products/accessory-crossbody.png" },
  { id: 207, name: "Studio Silver Bracelet", category: "Jewellery", price: 1199, image: "/images/products/accessory-bracelet.png" },
  { id: 208, name: "Classic Silver Necklace", category: "Jewellery", price: 1199, image: "/images/products/accessory-necklace.png" },
  { id: 209, name: "Minimal Steel Watch", category: "Watches", price: 3999, image: "/images/products/accessory-minimal-steel-watch.png" },
  { id: 210, name: "Silk Paisley Bandana", category: "Scarves", price: 1499, image: "/images/products/accessory-silk-paisley-bandana.png" },
  { id: 211, name: "Sculpted Silver Ring", category: "Jewellery", price: 1899, image: "/images/products/accessory-sculpted-silver-ring.png" },
  { id: 212, name: "Minimal Leather Cardholder", category: "Leather Goods", price: 1299, image: "/images/products/accessory-minimal-leather-cardholder.png" },
];

const collectionFor = (id: number) =>
  id >= 201 ? "accessories" : id >= 101 ? "women" : "men";

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
    `${product.name} ${product.category} ${collectionFor(product.id)}`
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
          <Link to="/collections">EXPLORE COLLECTIONS <ArrowRight size={16} /></Link>
        </section>
      ) : (
        <div className="ascend-search-grid">
          {filtered.map((product) => (
            <Link
              to={`/${collectionFor(product.id)}/${product.id}`}
              key={product.id}
              className="ascend-search-product"
            >
              <div className="ascend-search-image">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="ascend-search-product-info">
                <div>
                  <h2>{product.name}</h2>
                  <p>{collectionFor(product.id).toUpperCase()} / {product.category.toUpperCase()}</p>
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
