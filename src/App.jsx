
import { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import "./index.css";

import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";

import Cart from "./components/Cart";

import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
} from "./services/cartAPI";
const API_BASE_URL = import.meta.env.VITE_API_URL;

// PROTECT PRIVATE PAGES
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// HOMEPAGE
function Home({
  addToCart,
  cartCount,
  wishlistItems,
  toggleWishlist,
  handleLogout,
  isLoggedIn
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("10000");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Local product image fallbacks
  const localProductImages = {
    "Wireless Headphones": "/images/headphones.jpg",
    "Smart Watch": "/images/smartwatch.jpg",
    "Ladies Handbag": "/images/handbag.jpg",
    "Sports Shoes": "/images/shoes.jpg",
    "Sunglasses": "/images/sunglasses.jpg",
    "Digital Camera": "/images/camera.jpg",
    "Backpack": "/images/backpack.jpg",
    "Perfume": "/images/perfume.jpg",
  };

  // Fetch products from Django backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const response = await fetch(
  `${API_BASE_URL}/api/products/`
);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.results || [];

        const formattedProducts = productList.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          category: product.type || "Uncategorized",
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `${API_BASE_URL}${product.image}`
            : localProductImages[product.name],
          description: product.description,
          brand: product.brand,
          stock_quantity: product.stock_quantity,
        }));

        setProducts(formattedProducts);
        console.log("Products received from Django:", formattedProducts);
      } catch (err) {
        setError("Unable to load products. Please check your backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesMinPrice =
      product.price >= Number(minPrice || 0);

    const matchesMaxPrice =
      product.price <= Number(maxPrice || 10000);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  // Sorting
  const sortedProducts = [...filteredProducts];

  if (sortOption === "low-high") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high-low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "name-az") {
    sortedProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortOption === "name-za") {
    sortedProducts.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortOption("default");
    setMinPrice("0");
    setMaxPrice("10000");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">

          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-blue-600"
          >
            ShopEase<span className="text-slate-800">.</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <a href="#products" className="transition hover:text-blue-600">
              Products
            </a>

            <a href="#about" className="transition hover:text-blue-600">
              About
            </a>

            <a href="#contact" className="transition hover:text-blue-600">
              Contact
            </a>
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">

            {/* SHOW ACCOUNT OPTIONS WHEN LOGGED IN */}
            {isLoggedIn ? (
              <>
                <Link
                  to="/orders"
                  className="transition hover:text-blue-600"
                >
                  Orders
                </Link>

                <Link
                  to="/profile"
                  className="transition hover:text-blue-600"
                >
                  Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              /* SHOW LOGIN AND REGISTER WHEN LOGGED OUT */
              <>
                <Link
                  to="/login"
                  className="transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/wishlist"
              className="transition hover:text-pink-600"
            >
              ♡ {wishlistItems.length}
            </Link>

            <Link
              to="/cart"
              className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              🛒 Cart ({cartCount})
            </Link>

          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id="home"
        className="overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-20 md:flex-row md:px-8">

          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold tracking-[0.25em] text-blue-100">
              WELCOME TO SHOPEASE
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Discover Your
              <br />
              Favorite Products
            </h1>

            <p className="mt-6 max-w-lg text-lg text-blue-100">
              Shop smarter. Live better.
              Find everything you love in one place.
            </p>

            <a
              href="#products"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Shop Now →
            </a>
          </div>

          <div className="text-8xl md:text-9xl">
            🛍️
          </div>

        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section
        id="products"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >

        {/* API LOADING AND ERROR MESSAGES */}
        {loading && (
          <p className="py-8 text-center font-semibold text-blue-600">
            Loading products...
          </p>
        )}

        {error && (
          <p className="py-8 text-center font-semibold text-red-600">
            {error}
          </p>
        )}

        {/* SECTION HEADING */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Our Collection
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore Our Products
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500">
            Discover products you'll love, carefully selected for your everyday needs.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {["All", "Electronics", "Fashion", "Accessories", "Beauty"].map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {category === "All" ? "All Products" : category}
              </button>
            )
          )}
        </div>

        {/* FILTER PANEL */}
        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h3 className="text-lg font-bold text-slate-900">
              Filter Products
            </h3>

            <button
              type="button"
              onClick={resetFilters}
              className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
            >
              Reset all filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* SORT */}
            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort by
              </label>

              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="default">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>
            </div>

            {/* MINIMUM PRICE */}
            <div>
              <label
                htmlFor="minPrice"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Minimum Price (Rs.)
              </label>

              <input
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* MAXIMUM PRICE */}
            <div>
              <label
                htmlFor="maxPrice"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Maximum Price (Rs.)
              </label>

              <input
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* PRODUCT COUNT */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Our Products
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Find something perfect for you.
            </p>
          </div>

          <p className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {sortedProducts.length} products found
          </p>
        </div>

        {/* PRODUCT GRID */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => {
              const isWishlisted = wishlistItems.some(
                (item) => item.id === product.id
              );

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >

                  {/* WISHLIST BUTTON */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-md transition duration-200 hover:scale-110 ${
                      isWishlisted
                        ? "text-pink-600"
                        : "text-slate-500 hover:text-pink-600"
                    }`}
                  >
                    {isWishlisted ? "♥" : "♡"}
                  </button>

                  {/* PRODUCT IMAGE */}
                  <Link to={`/product/${product.id}`}>
                    <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* PRODUCT DETAILS */}
                  <div className="p-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                      {product.category}
                    </p>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="min-h-7 text-lg font-bold text-slate-900 transition hover:text-blue-600">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xl font-extrabold text-slate-900">
                        Rs. {product.price.toLocaleString("en-IN")}
                      </p>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        In Stock
                      </span>
                    </div>

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 active:scale-95"
                    >
                      Add to Cart +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY SEARCH RESULT */
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <p className="text-5xl">🔍</p>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or adjusting your filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="bg-white px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-semibold uppercase tracking-widest text-blue-600">
            About Us
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            About ShopEase
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Your favorite online shopping destination.
            Discover quality products at great prices.
            We make shopping simple, convenient and enjoyable.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="bg-slate-950 px-6 py-10 text-center text-white"
      >
        <h2 className="text-3xl font-extrabold text-blue-400">
          ShopEase.
        </h2>

        <p className="mt-3 text-slate-400">
          Your favorite online shopping destination.
        </p>

        <p className="mt-6 text-sm text-slate-500">
          © 2026 ShopEase. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// MAIN APP
function App() {

  // Login status
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("access_token"))
  );

  // Listen for login and storage changes
  useEffect(() => {
    const handleLogin = () => {
      setIsLoggedIn(true);
    };

    const handleStorageChange = () => {
      setIsLoggedIn(
        Boolean(localStorage.getItem("access_token"))
      );
    };

    window.addEventListener("userLoggedIn", handleLogin);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsLoggedIn(false);

    alert("Logged out successfully!");

    window.location.href = "/login";
  };

  // Shopping Cart
  const [cartItems, setCartItems] = useState([]);

  // Load the logged-in user's cart from Django
  useEffect(() => {
    let isActive = true;

    const loadCart = async () => {
      if (!isLoggedIn) {
        setCartItems([]);
        return;
      }

      try {
        const [cartResponse, productsResponse] = await Promise.all([
          getCart(),
          fetch(`${API_BASE_URL}/api/products/`)
        ]);

        if (!productsResponse.ok) {
          throw new Error("Unable to load products for your cart.");
        }

        const productsData = await productsResponse.json();
        const productList = Array.isArray(productsData)
          ? productsData
          : productsData.results || [];

        const localProductImages = {
          "Wireless Headphones": "/images/headphones.jpg",
          "Smart Watch": "/images/smartwatch.jpg",
          "Ladies Handbag": "/images/handbag.jpg",
          "Sports Shoes": "/images/shoes.jpg",
          "Sunglasses": "/images/sunglasses.jpg",
          "Digital Camera": "/images/camera.jpg",
          "Backpack": "/images/backpack.jpg",
          "Perfume": "/images/perfume.jpg"
        };

        const formattedProducts = productList.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          category: product.type || "Uncategorized",
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
             : `${API_BASE_URL}${product.image}`
            : localProductImages[product.name],
          description: product.description,
          brand: product.brand,
          stock_quantity: product.stock_quantity
        }));

        const cartRows = Array.isArray(cartResponse)
          ? cartResponse
          : cartResponse.results || [];

        const restoredCart = cartRows.map((cartRow) => {
          const product = formattedProducts.find(
            (item) => item.id === Number(cartRow.product)
          );

          if (!product) return null;

          return {
            ...product,
            id: product.id,
            cartItemId: cartRow.id,
            quantity: cartRow.quantity
          };
        }).filter(Boolean);

        if (isActive) {
          setCartItems(restoredCart);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();

    return () => {
      isActive = false;
    };
  }, [isLoggedIn]);

  const clearCart = async () => {
    try {
      const savedItems = cartItems.filter((item) => item.cartItemId);

      await Promise.all(
        savedItems.map((item) => deleteCartItem(item.cartItemId))
      );
    } catch (error) {
      console.error("Error clearing backend cart:", error);
    }

    setCartItems([]);
  };

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("shopease_orders");

      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Error loading orders:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "shopease_orders",
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error("Error saving orders:", error);
    }
  }, [orders]);

  const addOrder = (order) => {
    setOrders((previousOrders) => [
      order,
      ...previousOrders
    ]);
  };

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState([]);

  const toggleWishlist = (product) => {
    setWishlistItems((previousItems) => {
      const alreadySaved = previousItems.some(
        (item) => item.id === product.id
      );

      if (alreadySaved) {
        return previousItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...previousItems, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  };

  // Add to Cart
  const addToCart = async (product, quantity = 1) => {
    const existingProduct = cartItems.find(
      (item) => item.id === product.id
    );

    // Guests can still use the cart locally.
    if (!isLoggedIn) {
      setCartItems((previousItems) => {
        const existingItem = previousItems.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          return previousItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [...previousItems, { ...product, quantity }];
      });
      return;
    }

    try {
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;

        await updateCartItem(existingProduct.cartItemId, newQuantity);

        setCartItems((previousItems) =>
          previousItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        const createdItem = await addCartItem(product.id, quantity);

        setCartItems((previousItems) => [
          ...previousItems,
          {
            ...product,
            cartItemId: createdItem.id,
            quantity: createdItem.quantity
          }
        ]);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(error.message || "Unable to add this product to your cart.");
    }
  };

  // Update Quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    if (isLoggedIn && selectedItem.cartItemId) {
      try {
        await updateCartItem(selectedItem.cartItemId, newQuantity);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        alert(error.message || "Unable to update cart quantity.");
        return;
      }
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove from Cart
  const removeFromCart = async (id) => {
    const selectedItem = cartItems.find((item) => item.id === id);
    if (!selectedItem) return;

    if (isLoggedIn && selectedItem.cartItemId) {
      try {
        await deleteCartItem(selectedItem.cartItemId);
      } catch (error) {
        console.error("Error removing cart item:", error);
        alert(error.message || "Unable to remove this product.");
        return;
      }
    }

    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              addToCart={addToCart}
              cartCount={cartCount}
              wishlistItems={wishlistItems}
              toggleWishlist={toggleWishlist}
              handleLogout={handleLogout}
              isLoggedIn={isLoggedIn}
            />
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        {/* LOGIN AND REGISTER */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlistItems={wishlistItems}
              removeFromWishlist={removeFromWishlist}
              addToCart={addToCart}
            />
          }
        />

        {/* PROTECTED CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Checkout
                cartItems={cartItems}
                clearCart={clearCart}
                addOrder={addOrder}
              />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED ORDER CONFIRMATION */}
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyOrders orders={orders} />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
