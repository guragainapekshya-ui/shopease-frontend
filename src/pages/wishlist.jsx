
import { Link } from "react-router-dom";

function Wishlist({ wishlistItems, removeFromWishlist, addToCart }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Wishlist Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My Wishlist <span className="text-red-500">♡</span>
          </h1>

          <p className="text-gray-500 mt-3">
            Your favorite products, all in one place.
          </p>

          <Link
            to="/"
            className="inline-block mt-5 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Empty Wishlist */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-16 text-center">

            <div className="text-7xl text-red-400 mb-6">
              ♡
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your Wishlist is Empty!
            </h2>

            <p className="text-gray-500 mb-8">
              You haven't saved any favorite products yet.
            </p>

            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Explore Products
            </Link>

          </div>
        ) : (

          <>
            {/* Wishlist Count */}
            <p className="text-gray-500 mb-6">
              You have saved{" "}
              <span className="font-bold text-gray-800">
                {wishlistItems.length}
              </span>{" "}
              {wishlistItems.length === 1 ? "product" : "products"}.
            </p>

            {/* Wishlist Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

              {wishlistItems.map((product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition duration-300 group"
                >

                  {/* Product Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block bg-gray-50 p-5 relative"
                  >
                    <div className="h-56 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <span className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl text-red-500 shadow-sm">
                      ♥
                    </span>
                  </Link>

                  {/* Product Information */}
                  <div className="p-5">

                    <p className="text-sm text-blue-600 font-semibold mb-2">
                      {product.category}
                    </p>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xl font-bold text-blue-600 mt-3">
                      Rs. {product.price.toLocaleString("en-IN")}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 mt-6">

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition"
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="w-full border border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
                      >
                        Remove ♡
                      </button>

                    </div>
                  </div>

                </div>

              ))}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Wishlist;
