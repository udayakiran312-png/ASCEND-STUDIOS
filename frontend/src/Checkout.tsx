
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";


type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
};

type SavedOrder = {
  id: string;
  date: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
};

type OrderResponse = {
  success?: boolean;
  message?: string;
  order?: {
    id: string;
    createdAt: string;
  };
  subtotal?: number;
  shipping?: number;
  total?: number;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const CART_KEY = "ascend_cart";
const ORDER_KEY = "ascend_orders";
const LAST_ORDER_KEY = "ascend_last_order";
const TOKEN_KEY = "ascend_token";
const USER_KEY = "ascend_user";

function readCart(): CartItem[] {
  try {
    const data = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function readAccountEmail(): string {
  try {
    const user = JSON.parse(
      localStorage.getItem(USER_KEY) || "null"
    );

    return typeof user?.email === "string"
      ? user.email.trim().toLowerCase()
      : "";
  } catch {
    return "";
  }
}

function readPreviousOrders(): unknown[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem(ORDER_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>(readCart);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState<Customer>(() => ({
    name: "",
    email: readAccountEmail(),
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  }));

  useEffect(() => {
    const refresh = () => setItems(readCart());

    window.addEventListener("storage", refresh);
    window.addEventListener("ascend-cart-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ascend-cart-updated", refresh);
    };
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shipping;

  function update(field: keyof Customer, value: string) {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (placing) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const accountEmail = readAccountEmail();

    if (!token || !accountEmail) {
      setError("Please log in before placing your order.");
      return;
    }

    if (
      customer.email.trim().toLowerCase() !== accountEmail
    ) {
      setError(
        "Use the email address associated with your account."
      );
      return;
    }

    if (items.length === 0) {
      setError("Your bag is empty.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) {
      setError(
        "Enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (!/^\d{6}$/.test(customer.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer,
          items: items.map((item) => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const result: OrderResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not place your order."
        );
      }

      if (
        !result.order?.id ||
        typeof result.total !== "number" ||
        typeof result.subtotal !== "number" ||
        typeof result.shipping !== "number"
      ) {
        throw new Error(
          "The server returned an incomplete order confirmation. Check your order history before retrying."
        );
      }

      const order: SavedOrder = {
        id: result.order.id,
        date:
          result.order.createdAt ||
          new Date().toISOString(),
        customer: { ...customer },
        items: [...items],
        subtotal: result.subtotal,
        shipping: result.shipping,
        total: result.total,
        paymentMethod: "Cash on Delivery (Demo)",
        status: "Demo order placed",
      };

      // The backend has confirmed the order.
      // Preserve the previous browser history.
      try {
        const previousOrders = readPreviousOrders();

        localStorage.setItem(
          ORDER_KEY,
          JSON.stringify([order, ...previousOrders])
        );

        localStorage.setItem(
          LAST_ORDER_KEY,
          JSON.stringify(order)
        );
      } catch (storageError) {
        console.warn(
          "Order saved to database, but local order history could not be updated:",
          storageError
        );
      }

      // Clear the cart only after backend confirmation.
      try {
        localStorage.removeItem(CART_KEY);
        window.dispatchEvent(
          new Event("ascend-cart-updated")
        );
      } catch (storageError) {
        console.warn(
          "Order saved, but the browser cart could not be cleared:",
          storageError
        );
      }

      navigate("/order-success", {
        replace: true,
        state: { order },
      });
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not place your order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="checkout-empty">
        <span>ASCEND STUDIOS / CHECKOUT</span>

        <h1>YOUR BAG IS EMPTY.</h1>

        <p>
          Add something to your bag before checking out.
        </p>

        <Link to="/men">
          EXPLORE COLLECTION
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span>
          ASCEND STUDIOS / SECURE CHECKOUT
        </span>

        <h1>CHECKOUT</h1>

        <p>
          YOUR SELECTION. YOUR DETAILS.
        </p>
      </div>

      <div className="checkout-layout">
        <form
          id="ascend-checkout-form"
          className="checkout-form"
          onSubmit={placeOrder}
        >
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>01</span>
              <h2>CONTACT INFORMATION</h2>
            </div>

            <div className="checkout-fields">
              <label className="checkout-field">
                FULL NAME

                <input
                  required
                  autoComplete="name"
                  value={customer.name}
                  onChange={(e) =>
                    update("name", e.target.value)
                  }
                  placeholder="Your full name"
                />
              </label>

              <div className="checkout-field-row">
                <label className="checkout-field">
                  EMAIL ADDRESS

                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={customer.email}
                    onChange={(e) =>
                      update("email", e.target.value)
                    }
                    placeholder="you@example.com"
                  />
                </label>

                <label className="checkout-field">
                  PHONE NUMBER

                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      update("phone", e.target.value)
                    }
                    placeholder="10-digit mobile number"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>02</span>
              <h2>SHIPPING ADDRESS</h2>
            </div>

            <div className="checkout-fields">
              <label className="checkout-field">
                STREET ADDRESS

                <input
                  required
                  autoComplete="street-address"
                  value={customer.address}
                  onChange={(e) =>
                    update("address", e.target.value)
                  }
                  placeholder="House number and street"
                />
              </label>

              <label className="checkout-field">
                APARTMENT / LANDMARK (OPTIONAL)

                <input
                  value={customer.apartment}
                  onChange={(e) =>
                    update("apartment", e.target.value)
                  }
                  placeholder="Apartment, building or landmark"
                />
              </label>

              <div className="checkout-field-row">
                <label className="checkout-field">
                  CITY

                  <input
                    required
                    autoComplete="address-level2"
                    value={customer.city}
                    onChange={(e) =>
                      update("city", e.target.value)
                    }
                    placeholder="City"
                  />
                </label>

                <label className="checkout-field">
                  STATE

                  <input
                    required
                    autoComplete="address-level1"
                    value={customer.state}
                    onChange={(e) =>
                      update("state", e.target.value)
                    }
                    placeholder="State"
                  />
                </label>
              </div>

              <label className="checkout-field">
                PIN CODE

                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  value={customer.pincode}
                  onChange={(e) =>
                    update("pincode", e.target.value)
                  }
                  placeholder="6-digit PIN code"
                />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>03</span>
              <h2>PAYMENT METHOD</h2>
            </div>

            <div className="checkout-payment-option">
              <span className="checkout-payment-dot" />

              <div>
                <strong>
                  CASH ON DELIVERY Ã¢â‚¬â€ DEMO
                </strong>

                <p>
                  Portfolio demonstration only. No actual
                  order or payment will be processed.
                </p>
              </div>
            </div>
          </section>

          {error && (
            <p
              className="checkout-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="checkout-submit checkout-mobile-submit"
            disabled={placing}
          >
            {placing
              ? "PLACING ORDER..."
              : "PLACE DEMO ORDER"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>YOUR ORDER</h2>

          <div className="checkout-summary-items">
            {items.map((item) => (
              <div
                className="checkout-summary-item"
                key={`${item.id}-${item.size}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <strong>{item.name}</strong>

                  <span>
                    SIZE {item.size} / QTY{" "}
                    {item.quantity}
                  </span>

                  <span>
                    {money(item.price)}
                  </span>
                </div>

                <strong>
                  {money(
                    item.price * item.quantity
                  )}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div>
              <span>SUBTOTAL</span>
              <span>{money(subtotal)}</span>
            </div>

            <div>
              <span>SHIPPING</span>
              <span>
                {shipping === 0
                  ? "FREE"
                  : money(shipping)}
              </span>
            </div>

            <div className="checkout-grand-total">
              <strong>TOTAL</strong>
              <strong>{money(total)}</strong>
            </div>
          </div>

          <button
            type="submit"
            form="ascend-checkout-form"
            className="checkout-submit checkout-desktop-submit"
            disabled={placing}
          >
            {placing
              ? "PLACING ORDER..."
              : "PLACE DEMO ORDER"}
          </button>

          <Link
            to="/cart"
            className="checkout-back"
          >
            RETURN TO BAG
          </Link>

          <p className="checkout-disclaimer">
            This is a demo checkout. No real payment,
            shipment, or merchant order is created.
          </p>
        </aside>
      </div>
    </main>
  );
}

export function OrderSuccess() {
  const navigateLocation = useLocation();

  const [order] = useState<SavedOrder | null>(() => {
    const navigationOrder =
      navigateLocation.state?.order as
        | SavedOrder
        | undefined;

    if (navigationOrder?.id) {
      return navigationOrder;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(LAST_ORDER_KEY) || "null"
      );

      return saved?.id ? saved : null;
    } catch {
      return null;
    }
  });

  return (
    <main className="checkout-success">
      <span>
        ASCEND STUDIOS / ORDER CONFIRMATION
      </span>

      <div className="checkout-success-mark">
        Ã¢Å“â€œ
      </div>

      <h1>
        {order
          ? "ORDER PLACED."
          : "NO ORDER FOUND."}
      </h1>

      {order ? (
        <>
          <p>
            Thank you, {order.customer.name}.
            Your demo order has been saved
            successfully.
          </p>

          <div className="checkout-success-details">
            <div>
              <span>ORDER REFERENCE</span>
              <strong>{order.id}</strong>
            </div>

            <div>
              <span>ORDER TOTAL</span>
              <strong>
                {money(order.total)}
              </strong>
            </div>

            <div>
              <span>STATUS</span>
              <strong>DEMO ORDER</strong>
            </div>
          </div>

          <p className="checkout-success-note">
            Your demo order record has been saved
            to the database. No actual merchant
            order was submitted or payment collected.
          </p>
        </>
      ) : (
        <p>
          Complete checkout to view a demo
          order confirmation.
        </p>
      )}

      <Link to="/men">
        CONTINUE SHOPPING
      </Link>
    </main>
  );
}
