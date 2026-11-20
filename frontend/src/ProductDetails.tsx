
import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ProductDetails.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes?: string[];
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

const CART_KEY = "ascend_cart";
const WISHLIST_KEY = "ascend_wishlist";

const products: Product[] = [
  {
    id: 1,
    name: "Essential Heavyweight Tee",
    category: "T-SHIRTS",
    price: 1299,
    image: "/images/products/men-heavyweight-black.png",
    description:
      "A heavyweight everyday essential with a relaxed silhouette and premium feel.",
  },
  {
    id: 2,
    name: "Studio Overshirt",
    category: "SHIRTS",
    price: 2499,
    image: "/images/products/men-overshirt-stone.png",
    description:
      "A versatile stone overshirt designed for effortless layering.",
  },
  {
    id: 3,
    name: "Relaxed Pleated Trouser",
    category: "TROUSERS",
    price: 2799,
    image: "/images/products/men-pleated-trouser-black.png",
    description:
      "Relaxed tailoring with considered pleats and a contemporary silhouette.",
  },
  {
    id: 4,
    name: "Structured Wool Jacket",
    category: "OUTERWEAR",
    price: 4999,
    image: "/images/products/men-wool-jacket-black.png",
    description:
      "A structured outerwear piece with a refined, minimalist character.",
  },
  {
    id: 5,
    name: "Boxy Cotton Tee",
    category: "T-SHIRTS",
    price: 1499,
    image: "/images/products/men-boxy-cotton-tee.png",
    description:
      "A cropped boxy cotton tee with balanced proportions and a relaxed fit.",
  },
  {
    id: 6,
    name: "Classic Poplin Shirt",
    category: "SHIRTS",
    price: 2199,
    image: "/images/products/men-classic-poplin-white.png",
    description:
      "A crisp poplin shirt designed for modern everyday dressing.",
  },
  {
    id: 7,
    name: "Wide Leg Trouser",
    category: "TROUSERS",
    price: 2999,
    image: "/images/products/men-wide-leg-trouser-ivory.png",
    description:
      "An expressive wide-leg silhouette with flowing proportions.",
  },
  {
    id: 8,
    name: "Minimal Zip Jacket",
    category: "OUTERWEAR",
    price: 3999,
    image: "/images/products/men-minimal-zip-jacket-black.png",
    description:
      "Clean lines and understated detailing define this zip jacket.",
  },

  {
    id: 9,
    name: "Essential Grey Baggy Sweatpants",
    category: "TROUSERS",
    price: 1899,
    image: "/images/products/men-grey-baggy-sweatpants.png",
    description:
      "Relaxed grey sweatpants with a generous baggy fit and soft everyday comfort.",
  },
  {
    id: 10,
    name: "Relaxed Linen Shirt",
    category: "SHIRTS",
    price: 2399,
    image: "/images/products/men-relaxed-linen-shirt.png",
    description:
      "A breathable linen shirt with a relaxed silhouette, effortless drape, and refined everyday appeal.",
  },
  {
    id: 11,
    name: "Charcoal Knit Polo",
    category: "SHIRTS",
    price: 2299,
    image: "/images/products/men-charcoal-knit-polo.png",
    description:
      "A refined charcoal knit polo with a textured finish, relaxed tailoring, and understated luxury.",
  },
  {
    id: 12,
    name: "Midnight Quarter-Zip Knit",
    category: "SHIRTS",
    price: 2699,
    image: "/images/products/men-midnight-quarter-zip.png",
    description:
      "An oversized charcoal quarter-zip knit with a structured collar, textured finish, and contemporary streetwear silhouette.",
  },

  // WOMEN
  {
    id: 101,
    name: "Essential Fitted Tee",
    category: "TOPS",
    price: 1299,
    image: "/images/products/women-essential-fitted-tee.png",
    description:
      "A refined fitted tee designed for effortless everyday styling.",
  },
  {
    id: 102,
    name: "Relaxed Poplin Shirt",
    category: "SHIRTS",
    price: 2199,
    image: "/images/products/women-relaxed-poplin-shirt.png",
    description:
      "A crisp poplin shirt with relaxed proportions and timeless appeal.",
  },
  {
    id: 103,
    name: "Minimal Slip Dress",
    category: "DRESSES",
    price: 2999,
    image: "/images/products/women-minimal-slip-dress.png",
    description:
      "Fluid satin-inspired elegance with an understated silhouette.",
  },
  {
    id: 104,
    name: "Tailored Wide Leg Trouser",
    category: "TROUSERS",
    price: 2799,
    image: "/images/products/women-tailored-wide-leg-trouser.png",
    description:
      "Contemporary tailoring with a flowing wide-leg silhouette.",
  },
  {
    id: 105,
    name: "Structured Studio Blazer",
    category: "OUTERWEAR",
    price: 4999,
    image: "/images/products/women-structured-studio-blazer.png",
    description:
      "Sharp tailoring and considered proportions for modern dressing.",
  },
  {
    id: 106,
    name: "Boxy Cotton Top",
    category: "TOPS",
    price: 1499,
    image: "/images/products/women-boxy-cotton-top.png",
    description:
      "A relaxed cotton essential with a modern boxy silhouette.",
  },
  {
    id: 107,
    name: "Classic Midi Dress",
    category: "DRESSES",
    price: 3499,
    image: "/images/products/women-classic-midi-dress.png",
    description:
      "A timeless midi dress balancing structure and effortless movement.",
  },
  {
    id: 108,
    name: "Minimal Cropped Jacket",
    category: "OUTERWEAR",
    price: 3999,
    image: "/images/products/women-minimal-cropped-jacket.png",
    description:
      "A contemporary cropped jacket with clean, minimal detailing.",
  },


  {
    id: 109,
    name: "Sculpted Ribbed Knit Top",
    category: "TOPS",
    price: 2299,
    image: "/images/products/women-sculpted-ribbed-knit-top.png",
    description:
      "A fitted charcoal ribbed knit top with an elegant silhouette, soft texture, and refined minimalist styling.",
  },
  {
    id: 110,
    name: "Draped Satin Shirt",
    category: "SHIRTS",
    price: 2399,
    image: "/images/products/women-draped-satin-shirt.png",
    description:
      "An elegant ivory satin shirt with a fluid drape, relaxed fit, and refined contemporary styling.",
  },
  {
    id: 111,
    name: "Relaxed Cargo Trouser",
    category: "TROUSERS",
    price: 2699,
    image: "/images/products/women-relaxed-cargo-trouser.png",
    description:
      "Oversized stone-grey cargo trousers with a relaxed silhouette, utility pockets, and contemporary streetwear styling.",
  },
  {
    id: 112,
    name: "Longline Trench Coat",
    category: "OUTERWEAR",
    price: 4799,
    image: "/images/products/women-longline-trench-coat.png",
    description:
      "A sophisticated taupe trench coat featuring a relaxed longline silhouette, double-breasted design, and adjustable waist belt.",
  },

  // ACCESSORIES
  {
    id: 201,
    name: "Minimal Leather Wallet",
    category: "LEATHER GOODS",
    price: 1499,
    image: "/images/products/accessory-wallet.png",
    description:
      "A compact leather wallet with clean lines and considered everyday functionality.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 202,
    name: "Essential Leather Belt",
    category: "LEATHER GOODS",
    price: 1299,
    image: "/images/products/accessory-belt.png",
    description:
      "A refined leather belt designed to complete modern everyday dressing.",
    sizes: ["30", "32", "34", "36", "38"],
  },
  {
    id: 203,
    name: "Minimal Black Sunglasses",
    category: "EYEWEAR",
    price: 1799,
    image: "/images/products/accessory-sunglasses.png",
    description:
      "Minimal black sunglasses with a timeless silhouette and understated attitude.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 204,
    name: "Studio Baseball Cap",
    category: "HEADWEAR",
    price: 899,
    image: "/images/products/accessory-cap.png",
    description:
      "A versatile everyday baseball cap with a clean studio-inspired finish.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 205,
    name: "Minimal Leather Tote",
    category: "BAGS",
    price: 2999,
    image: "/images/products/accessory-tote.png",
    description:
      "A spacious minimalist tote balancing everyday practicality with refined design.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 206,
    name: "Classic Crossbody Bag",
    category: "BAGS",
    price: 2499,
    image: "/images/products/accessory-crossbody.png",
    description:
      "A compact crossbody bag designed for effortless everyday movement.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 207,
    name: "Studio Silver Bracelet",
    category: "JEWELLERY",
    price: 1199,
    image: "/images/products/accessory-bracelet.png",
    description:
      "A polished silver-tone bracelet with a refined minimalist character.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 208,
    name: "Classic Silver Necklace",
    category: "JEWELLERY",
    price: 1199,
    image: "/images/products/accessory-necklace.png",
    description:
      "A timeless silver-tone necklace designed for understated everyday expression.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 209,
    name: "Minimal Steel Watch",
    category: "WATCHES",
    price: 3999,
    image: "/images/products/accessory-minimal-steel-watch.png",
    description:
      "A refined stainless-steel watch featuring a matte-black dial, minimalist silver markers, and a brushed metal bracelet.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 210,
    name: "Silk Paisley Bandana",
    category: "SCARVES",
    price: 1499,
    image: "/images/products/accessory-silk-paisley-bandana.png",
    description:
      "A premium black silk bandana featuring intricate ivory paisley patterns, a smooth finish, and versatile styling.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 211,
    name: "Sculpted Silver Ring",
    category: "JEWELLERY",
    price: 1899,
    image: "/images/products/accessory-sculpted-silver-ring.png",
    description:
      "A polished silver-tone ring with a fluid sculptural silhouette, designed for understated contemporary elegance.",
    sizes: ["ONE SIZE"],
  },
  {
    id: 212,
    name: "Minimal Leather Cardholder",
    category: "LEATHER GOODS",
    price: 1299,
    image: "/images/products/accessory-minimal-leather-cardholder.png",
    description:
      "A slim black leather cardholder featuring refined stitching, multiple card slots, and a minimalist design.",
    sizes: ["ONE SIZE"],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

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

function readCart(): CartItem[] {
  try {
    const stored = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();

  const collection = location.pathname.startsWith("/accessories/")
    ? "accessories"
    : location.pathname.startsWith("/women/")
      ? "women"
      : "men";

  const product = products.find((item) => {
    if (item.id !== Number(id)) return false;

    if (collection === "accessories") {
      return item.id >= 201;
    }

    if (collection === "women") {
      return item.id >= 101 && item.id < 201;
    }

    return item.id < 101;
  });

  // Keep recommendations in the same collection and exclude the current product.
  // Items from the same product category come first, just like the earlier upgrade.
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const inCollection = (item: Product) =>
      collection === "accessories"
        ? item.id >= 201
        : collection === "women"
          ? item.id >= 101 && item.id < 201
          : item.id < 101;

    return products
      .filter((item) => item.id !== product.id && inCollection(item))
      .sort(
        (a, b) =>
          Number(b.category === product.category) -
          Number(a.category === product.category)
      )
      .slice(0, 4);
  }, [product, collection]);

  const sizeOptions = product?.sizes ?? ["S", "M", "L", "XL"];

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>(readWishlist);

  useEffect(() => {
    setSize("");
    setQuantity(1);
    setMessage("");
  }, [id, collection]);

  useEffect(() => {
    const refresh = () => setWishlist(readWishlist());

    window.addEventListener("storage", refresh);
    window.addEventListener("ascend-wishlist-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "ascend-wishlist-updated",
        refresh
      );
    };
  }, []);

  const isWishlisted = product
    ? wishlist.some((item) => item.id === product.id)
    : false;

  function toggleWishlist() {
    if (!product) return;

    const existing = readWishlist();

    const alreadySaved = existing.some(
      (item) => item.id === product.id
    );

    const updated: WishlistItem[] = alreadySaved
      ? existing.filter((item) => item.id !== product.id)
      : [
          ...existing,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
          },
        ];

    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(updated)
      );

      setWishlist(updated);

      window.dispatchEvent(
        new Event("ascend-wishlist-updated")
      );

      setMessage(
        alreadySaved
          ? "Removed from wishlist."
          : "Added to wishlist."
      );
    } catch {
      setMessage("Unable to update wishlist.");
    }
  }

  function addToBag() {
    if (!product) return;

    if (!size) {
      setMessage("Please select a size.");
      return;
    }

    const existing = readCart();

    const match = existing.find(
      (item) =>
        item.id === product.id && item.size === size
    );

    const updated: CartItem[] = match
      ? existing.map((item) =>
          item.id === product.id && item.size === size
            ? {
                ...item,
                quantity: Math.min(
                  10,
                  item.quantity + quantity
                ),
              }
            : item
        )
      : [
          ...existing,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size,
            quantity,
          },
        ];

    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event("ascend-cart-updated")
      );

      setMessage("Added to your bag.");
    } catch {
      setMessage("Unable to add product to bag.");
    }
  }

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>PRODUCT NOT FOUND</h1>
        <Link to={`/${collection}`}>
          BACK TO {collection.toUpperCase()}
        </Link>
      </main>
    );
  }

  return (
    <main
       className={`product-details-page ${
        collection === "accessories" ? "accessory-detail-page" : ""
        }`}
    >
      <div className="product-breadcrumb">
        <Link to="/">HOME</Link>
        <span>/</span>
        <Link to={`/${collection}`}>
          {collection.toUpperCase()}
        </Link>
        <span>/</span>
        <span>{product.name.toUpperCase()}</span>
      </div>

      <div className="product-details-layout">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-content">
          <span className="product-details-category">
            ASCEND STUDIOS / {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            {formatPrice(product.price)}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-size-section">
            <div className="product-field-heading">
              <span>SELECT SIZE</span>
              <span>{size || "NOT SELECTED"}</span>
            </div>

            <div className="product-size-options">
              {sizeOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={
                    size === option ? "selected" : ""
                  }
                  onClick={() => {
                    setSize(option);
                    setMessage("");
                  }}
                  aria-pressed={size === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity-section">
            <span>QUANTITY</span>

            <div className="product-quantity-control">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= 10}
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(10, current + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className="product-add-button"
            onClick={addToBag}
          >
            ADD TO BAG —{" "}
            {formatPrice(product.price * quantity)}
          </button>

          <button
            type="button"
            onClick={toggleWishlist}
            aria-pressed={isWishlisted}
            style={{
              width: "100%",
              minHeight: "55px",
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              border: "1px solid #202020",
              background: isWishlisted
                ? "#202020"
                : "transparent",
              color: isWishlisted
                ? "#ffffff"
                : "#202020",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              cursor: "pointer",
            }}
          >
            <Heart
              size={17}
              strokeWidth={1.7}
              fill={
                isWishlisted ? "currentColor" : "none"
              }
            />

            {isWishlisted
              ? "REMOVE FROM WISHLIST"
              : "SAVE TO WISHLIST"}
          </button>

          {message && (
            <p
              className="product-action-message"
              role="status"
            >
              {message}
            </p>
          )}

          <div className="product-details-extra">
            <div>
              CONSIDERED DESIGN. EVERYDAY WEAR.
            </div>
            <div>
              SHIPPING CALCULATED AT CHECKOUT.
            </div>
            <div>
              ASCEND STUDIOS — COLLECTION 2026
            </div>
          </div>
        </div>
      </div>

      {/* The only new feature: related products beneath the original layout. */}
      {relatedProducts.length > 0 && (
        <section
          className="product-related"
          aria-labelledby="ascend-related-heading"
        >
          <div className="product-related-heading">
            <span>CURATED FOR YOU</span>
            <h2 id="ascend-related-heading">YOU MAY ALSO LIKE</h2>
          </div>

          <div className="product-related-grid">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                className="product-related-card"
                to={`/${collection}/${item.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                aria-label={`View ${item.name}`}
              >
                <div className="product-related-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="product-related-meta">
                  <div>
                    <span>{item.category}</span>
                    <strong>{item.name}</strong>
                  </div>
                  <span>{formatPrice(item.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
