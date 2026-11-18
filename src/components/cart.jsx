
import { Link, useNavigate } from "react-router-dom";

function Cart({ cartItems, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-2">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-16 text-center">
            <div className="text-7xl mb-6">🛒</div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your cart is empty!
            </h2>

            <p className="text-gray-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Products */}
            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row gap-5"
                >

                  {/* Product Image */}
                  <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center sm:w-36 sm:h-36">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 sm:h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-center">

                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="text-blue-600 font-semibold mt-2">
                      Rs. {item.price.toLocaleString("en-IN")}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-5">
                      <span className="text-sm text-gray-500">
                        Quantity:
                      </span>

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-9 h-9 text-lg font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span className="w-10 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 text-lg font-bold text-gray-700 hover:bg-gray-100"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm font-semibold mt-4 text-left hover:text-red-700 transition"
                    >
                      Remove Item
                    </button>

                  </div>

                  {/* Item Total */}
                  <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center">
                    <p className="text-sm text-gray-500 sm:mb-2">
                      Item Total
                    </p>

                    <p className="text-lg font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>
              ))}

            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="flex justify-between text-gray-600 mb-4">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">
                    Rs. {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 mb-5">
                  <span>Shipping</span>
                  <span className="text-sm text-gray-500">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-5 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-blue-600">
                      Rs. {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition duration-200 shadow-md"
                >
                  Proceed to Checkout →
                </button>

                <p className="text-center text-xs text-gray-400 mt-5">
                  Thank you for shopping with ShopEase!
                </p>

              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
