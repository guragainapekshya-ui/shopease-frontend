
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setQuantity(1);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${id}/`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        const formattedProduct = {
          id: data.id,
          name: data.name,
          price: Number(data.price),
          category: data.type || "Uncategorized",
          image: data.image
            ? data.image.startsWith("http")
              ? data.image
              : `${API_BASE_URL}${data.image}`
            : localProductImages[data.name],
          description: data.description,
          brand: data.brand,
          stock_quantity: Number(data.stock_quantity || 0),
        };

        setProduct(formattedProduct);
      } catch (err) {
        console.error("Product Details Error:", err);
        setError("Unable to load this product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-blue-600">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Product Not Found!
        </h2>

        <p className="text-gray-500 mb-6">
          {error || "Sorry, this product does not exist."}
        </p>

        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    addToCart(product, quantity);
    alert(`${quantity} ${product.name} added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition mb-8"
        >
          <span>←</span> Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 bg-white rounded-3xl shadow-lg p-5 sm:p-8 lg:p-12">

          <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-6 min-h-80">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-contain hover:scale-105 transition duration-300"
            />
          </div>

          <div className="flex flex-col justify-center">

            <span className="inline-block w-fit bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-5">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-blue-600 mb-6">
              Rs. {product.price.toLocaleString("en-IN")}
            </p>

            <p className="text-gray-600 leading-7 mb-4">
              {product.description}
            </p>

            {product.brand && (
              <p className="text-gray-600 mb-4">
                Brand: {product.brand}
              </p>
            )}

            <div className="border-t border-gray-200 pt-6">

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quantity
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() =>
                    setQuantity((previous) => Math.max(1, previous - 1))
                  }
                  className="w-11 h-11 rounded-lg border border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 transition"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="text-xl font-semibold text-gray-800 min-w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((previous) =>
                      Math.min(product.stock_quantity, previous + 1)
                    )
                  }
                  disabled={quantity >= product.stock_quantity}
                  className="w-11 h-11 rounded-lg border border-gray-300 text-xl font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  Total Price
                </span>

                <span className="text-xl font-bold text-blue-700">
                  Rs. {(product.price * quantity).toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-gray-600 mb-5">
                {product.stock_quantity > 0
                  ? `Available stock: ${product.stock_quantity}`
                  : "Out of Stock"}
              </p>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-95 transition duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock_quantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <Link
                to="/cart"
                className="block text-center mt-5 text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                View Shopping Cart →
              </Link>

            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Product Information
          </h2>

          <p className="text-gray-600">
            Category: {product.category}
          </p>

          <p className="text-gray-600 mt-2">
            Availability:{" "}
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
