
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

const CART_KEY = "ascend_cart";

function readCart(): CartItem[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

// Identify the collection using existing product IDs.
function getProductCollection(id: number) {
  if (id >= 201) return "accessories";
  if (id >= 101) return "women";
  return "men";
}

function getProductLink(id: number) {
  return `/${getProductCollection(id)}/${id}`;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    const refresh = () => setItems(readCart());

    window.addEventListener("storage", refresh);
    window.addEventListener("ascend-cart-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "ascend-cart-updated",
        refresh
      );
    };
  }, []);

  function saveCart(updated: CartItem[]) {
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(updated)
      );

      setItems(updated);

      window.dispatchEvent(
        new Event("ascend-cart-updated")
      );
    } catch {
      // Keep the existing cart if saving fails.
    }
  }

  function updateQuantity(
    id: number,
    size: string,
    change: number
  ) {
    saveCart(
      items.map((item) =>
        item.id === id && item.size === size
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(10, item.quantity + change)
              ),
            }
          : item
      )
    );
  }

  function removeItem(id: number, size: string) {
    saveCart(
      items.filter(
        (item) =>
          !(item.id === id && item.size === size)
      )
    );
  }

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-header">
        <span>ASCEND STUDIOS / YOUR SELECTION</span>
        <h1>YOUR BAG</h1>
        <p>{totalQuantity} ITEMS</p>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <h2>YOUR BAG IS EMPTY.</h2>

          <p>
            Discover pieces made for everyday expression.
          </p>

          <Link
            to="/men"
            className="cart-primary-link"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section
            className="cart-items"
            aria-label="Shopping bag items"
          >
            {items.map((item) => {
              const collection = getProductCollection(
                item.id
              );

              const productLink = getProductLink(
                item.id
              );

              return (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}`}
                >
                  <Link
                    to={productLink}
                    className="cart-item-image"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  <div className="cart-item-details">
                    <div>
                      <span className="cart-item-label">
                        ASCEND STUDIOS /{" "}
                        {collection.toUpperCase()}
                      </span>

                      <Link
                        to={productLink}
                        className="cart-item-name"
                      >
                        {item.name}
                      </Link>

                      <p>SIZE: {item.size}</p>

                      <p>
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= 10}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.size
                          )
                        }
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>

                  <strong className="cart-line-total">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </strong>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h2>ORDER SUMMARY</h2>

            <div className="cart-summary-row">
              <span>SUBTOTAL</span>
              <strong>
                {formatPrice(subtotal)}
              </strong>
            </div>

            <div className="cart-summary-row">
              <span>SHIPPING</span>
              <span>
                CALCULATED AT CHECKOUT
              </span>
            </div>

            <div className="cart-summary-total">
              <span>SUBTOTAL</span>
              <strong>
                {formatPrice(subtotal)}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="cart-checkout"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              to="/men"
              className="cart-continue"
            >
              CONTINUE SHOPPING
            </Link>

            <p className="cart-summary-note">
              Shipping and any applicable charges
              are confirmed during checkout.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
