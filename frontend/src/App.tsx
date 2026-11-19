
import { Routes, Route, useLocation } from "react-router-dom";
import Accessories from "./Accessories";
import Navbar from "./components/Navbar";
import CategoryStrip from "./components/CategoryStrip";
import WinterEdit from "./WinterEdit";
import StoreBenefits from "./components/StoreBenefits";
import Footer from "./components/Footer";
import Women from "./Women";
import Men from "./Men";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Checkout, { OrderSuccess } from "./Checkout";
import Wishlist from "./Wishlist";
import Search from "./Search";
import { Login, Register, Account } from "./Auth";
import Collections from "./Collections";
import { useLayoutEffect } from "react";

import "./App.css";

function Home() {
  return (
    <main className="home-page">
      <section
        className="home-hero"
        aria-label="ASCEND STUDIOS new collection"
      >
        <img
          src="/images/ascend-hero.png"
          alt="ASCEND STUDIOS fashion campaign"
          className="home-hero-image"
        />

        <div className="hero-tagline">
          MAKE IT
          <br />
          TO THE
          <br />
          HIGH FASHION.
          <span className="hero-tagline-line" />
        </div>

        <div className="hero-actions">
          <a href="/men" className="hero-shop-button">
            SHOP NOW
          </a>

          <a href="/collections" className="hero-explore-link">
            EXPLORE COLLECTION
          </a>
        </div>

        <div className="hero-season">
          NEW
          <br />
          COLLECTION
          <br />
          2026
          <span className="hero-season-line" />
        </div>
      </section>

      <CategoryStrip />
      <WinterEdit />
      <StoreBenefits />
    </main>
  );
}

/**
 * Replays a subtle fade/slide reveal whenever an element re-enters the viewport.
 * Explicit selectors protect the hero, navigation and interactive form controls.
 */
function GlobalScrollReveal() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>("main");
    if (!main || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Existing ASCEND STUDIOS component classes, across every route.
    // Avoid selecting a grid and its cards together, or form inputs/buttons.
    const selectors = [
      ".category-item",
      ".winter-edit",
      ".store-benefit",
      ".men-heading",
      ".men-results",
      ".men-product",
      ".men-end",
      ".collections-heading",
      ".collections-card",
      ".product-not-found > h1",
      ".product-breadcrumb",
      ".product-details-image",
      ".product-details-content",
      ".cart-header",
      ".cart-item",
      ".cart-summary",
      ".cart-empty",
      ".wishlist-heading",
      ".wishlist-product",
      ".wishlist-empty",
      ".ascend-search-heading",
      ".ascend-search-results-heading",
      ".ascend-search-product",
      ".ascend-search-empty",
      ".checkout-empty > h1",
      ".checkout-heading",
      ".checkout-section",
      ".checkout-summary",
      ".checkout-success > h1",
      ".checkout-success-details",
      ".checkout-success-note",
      ".auth-heading",
      ".account-card",
      ".account-panel-heading",
      ".account-profile-fields",
      ".account-quick-links",
      ".account-order",
      ".account-empty-state",
      ".account-address-card",
    ].join(", ");

    const watched = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Don't unobserve: resetting off-screen makes the effect unlimited.
          entry.target.classList.toggle(
            "ascend-reveal-visible",
            entry.isIntersecting
          );
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    const register = () => {
      main.querySelectorAll<HTMLElement>(selectors).forEach((element) => {
        if (watched.has(element)) return;
        watched.add(element);
        element.classList.add("ascend-scroll-reveal");
        observer.observe(element);
      });
    };

    register();

    // Products, orders and account sections can appear after an async update.
    // Only child-list changes are watched, not the CSS classes we toggle.
    const changes = new MutationObserver(register);
    changes.observe(main, { childList: true, subtree: true });

    // Global footer also reveals on every page.
    const footer = document.querySelector<HTMLElement>("footer");
    if (footer) {
      watched.add(footer);
      footer.classList.add("ascend-scroll-reveal");
      observer.observe(footer);
    }

    return () => {
      changes.disconnect();
      observer.disconnect();
      watched.forEach((element) => {
        element.classList.remove("ascend-scroll-reveal", "ascend-reveal-visible");
      });
    };
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/accessories/:id" element={<ProductDetails />} />
        <Route path="/collections" element={<Collections />} />

        {/* MEN COLLECTION */}
        <Route path="/men" element={<Men />} />
        <Route
          path="/men/:id"
          element={<ProductDetails />}
        />

        {/* WOMEN COLLECTION */}
        <Route path="/women" element={<Women />} />
        <Route
          path="/women/:id"
          element={<ProductDetails />}
        />

        {/* SHOPPING */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<Search />} />

        {/* ACCOUNT */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      <GlobalScrollReveal />
        
      <Footer />
    </>
  );
}
