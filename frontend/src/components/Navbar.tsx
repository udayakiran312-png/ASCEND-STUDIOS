
import { useState } from "react";
import {
  Menu,
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";

import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoggedIn = Boolean(
    localStorage.getItem("ascend_token")
  );

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-track">
          {[0, 1].map((copy) => (
            <div className="announcement-group" key={copy}>
              <span>
                FREE DELIVERY ON ORDERS ABOVE {"\u20B9"}1999
              </span>

              <span>
                DISCOVER THE WINTER COLLECTION 2026
              </span>

              <span>
                NEW SEASON. NEW ESSENTIALS.
              </span>

              <span>
                ASCEND STUDIOS — ELEVATE YOUR STYLE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <div className="navbar-main">
          {/* Mobile Menu */}
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={22} strokeWidth={1.6} />
            ) : (
              <Menu size={22} strokeWidth={1.6} />
            )}
          </button>

          {/* Brand Logo */}
          <a
            href="/"
            className="brand-logo"
            aria-label="ASCEND STUDIOS — Home"
          >
            <span className="brand-monogram">
              <img
                src="/images/ascend-as-logo.png"
                alt=""
                className="brand-monogram-image"
              />
            </span>

            <span className="brand-wordmark">
              <span className="logo-ascend">
                ASCEND
              </span>

              <span className="logo-studios">
                STUDIOS
              </span>
            </span>
          </a>

          {/* Navigation Links */}
          <nav
            id="main-navigation"
            className={`main-navigation ${
              menuOpen ? "open" : ""
            }`}
            aria-label="Main navigation"
          >
            <a
              href="/collections"
              onClick={() => setMenuOpen(false)}
            >
              COLLECTIONS
            </a>

            <a
              href="/men"
              onClick={() => setMenuOpen(false)}
            >
              MEN
            </a>

            <a
              href="/women"
              onClick={() => setMenuOpen(false)}
            >
              WOMEN
            </a>

            <a
              href="/accessories"
              onClick={() => setMenuOpen(false)}
            >
              ACCESSORIES
            </a>
          </nav>
        </div>

        {/* Header Action Icons */}
        <div className="header-actions">
          {/* Search */}
          <button
            type="button"
            aria-label={
              searchOpen ? "Close search" : "Open search"
            }
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? (
              <X size={21} strokeWidth={1.6} />
            ) : (
              <Search size={21} strokeWidth={1.6} />
            )}
          </button>

          {/* Account */}
          <a
            href={isLoggedIn ? "/account" : "/login"}
            aria-label={
              isLoggedIn ? "My Account" : "Sign In"
            }
            title={
              isLoggedIn ? "My Account" : "Sign In"
            }
          >
            <UserRound
              size={21}
              strokeWidth={1.6}
            />
          </a>

          {/* Wishlist */}
          <a
            href="/wishlist"
            aria-label="Wishlist"
          >
            <Heart
              size={21}
              strokeWidth={1.6}
            />
          </a>

          {/* Shopping Bag */}
          <a
            href="/cart"
            aria-label="Shopping bag"
          >
            <ShoppingBag
              size={21}
              strokeWidth={1.6}
            />
          </a>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <form
            id="header-search"
            className="header-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();

              const query = searchQuery.trim();

              if (query) {
                window.location.href =
                  `/search?q=${encodeURIComponent(query)}`;
              }
            }}
          >
            <Search
              size={19}
              strokeWidth={1.6}
            />

            <input
              type="search"
              placeholder="Search collections, clothing..."
              aria-label="Search products"
              autoFocus
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
            />

            <button type="submit">
              SEARCH
            </button>
          </form>
        )}
      </header>
    </>
  );
}
