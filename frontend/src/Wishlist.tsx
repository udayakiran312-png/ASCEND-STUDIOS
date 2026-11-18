
import { useEffect, useState } from "react";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

const WISHLIST_KEY = "ascend_wishlist";

function readWishlist(): WishlistItem[] {
  try {
    const stored = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || "[]"
    );

    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

const money = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// Identify collection using existing product IDs.
function getProductCollection(id: number) {
  if (id >= 201) return "accessories";
  if (id >= 101) return "women";
  return "men";
}

function getProductLink(id: number) {
  return `/${getProductCollection(id)}/${id}`;
}

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>(
    readWishlist
  );

  useEffect(() => {
    const refresh = () => setItems(readWishlist());

    window.addEventListener("storage", refresh);
    window.addEventListener(
      "ascend-wishlist-updated",
      refresh
    );

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "ascend-wishlist-updated",
        refresh
      );
    };
  }, []);

  function removeItem(id: number) {
    const updated = readWishlist().filter(
      (item) => item.id !== id
    );

    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(updated)
      );

      setItems(updated);

      window.dispatchEvent(
        new Event("ascend-wishlist-updated")
      );
    } catch {
      // Keep existing wishlist if saving fails.
    }
  }

  return (
    <main className="wishlist-page">
      <header className="wishlist-heading">
        <span>ASCEND STUDIOS / YOUR SELECTION</span>

        <h1>WISHLIST</h1>

        <p>
          {items.length}{" "}
          {items.length === 1 ? "ITEM" : "ITEMS"}
        </p>
      </header>

      {items.length === 0 ? (
        <section className="wishlist-empty">
          <Heart size={38} strokeWidth={1.1} />

          <h2>NOTHING SAVED YET.</h2>

          <p>Keep the pieces that speak to you.</p>

          <Link
            to="/men"
            className="wishlist-shop"
          >
            EXPLORE COLLECTION
            <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="wishlist-grid">
          {items.map((item) => {
            const collection = getProductCollection(
              item.id
            );

            const productLink = getProductLink(
              item.id
            );

            return (
              <article
                className="wishlist-product"
                key={item.id}
              >
                <div className="wishlist-image-wrap">
                  <Link to={productLink}>
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  <button
                    type="button"
                    className="wishlist-remove"
                    aria-label={`Remove ${item.name} from wishlist`}
                    title="Remove from wishlist"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    <Trash2
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="wishlist-product-info">
                  <div>
                    <Link to={productLink}>
                      <h2>{item.name}</h2>
                    </Link>

                    <p>
                      ASCEND STUDIOS /{" "}
                      {collection.toUpperCase()}
                    </p>
                  </div>

                  <strong>
                    {money(item.price)}
                  </strong>
                </div>

                <Link
                  to={productLink}
                  className="wishlist-view-product"
                >
                  SELECT SIZE & ADD TO BAG
                  <ArrowRight size={15} />
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
