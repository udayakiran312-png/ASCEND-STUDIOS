
import { Routes, Route } from "react-router-dom";
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

import "./App.css";

function Home() {
  return (
    <main>
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
        
      <Footer />
    </>
  );
}
