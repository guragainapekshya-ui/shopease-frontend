
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/orders/`;
const PAYMENT_API_URL = `${API_BASE_URL}/api/payments/initiate/`;

function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Please log in before placing your order.");
      }

      // Step 1: Create the order in Django
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || JSON.stringify(data));
      }

      // Step 2: Prepare order information
      const order = {
        orderId: data.id,
        customer: { ...formData },
        items: cartItems.map((item) => ({ ...item })),
        total: Number(data.total_amount),
        paymentMethod:
          paymentMethod === "cod" ? "Cash on Delivery" : "Khalti",
        orderDate: new Date(data.created_at).toLocaleString(),
        status: data.status,
      };

      // Step 3: Handle Khalti payment
      if (paymentMethod === "khalti") {
        const paymentResponse = await fetch(PAYMENT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: data.id,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(
            paymentData.detail || "Unable to start Khalti payment."
          );
        }

        if (!paymentData.payment_url) {
          throw new Error("Khalti did not return a payment URL.");
        }

        // Save the cart/order information before leaving ShopEase
        localStorage.setItem(
          "shopease_pending_order",
          JSON.stringify(order)
        );

        clearCart();

        // Redirect customer to Khalti Sandbox
        window.location.href = paymentData.payment_url;
        return;
      }

      // Step 4: Existing Cash on Delivery flow
      clearCart();

      navigate("/order-confirmation", {
        state: { order },
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Your Cart is Empty!
          </h2>

          <p className="text-gray-500 mb-6">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Checkout
        </h1>

        <p className="text-gray-500 mb-6">
          Complete your delivery information to place your order.
        </p>

        <Link
          to="/cart"
          className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold mb-8"
        >
          ← Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Delivery Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="4"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="w-5 h-5 accent-indigo-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>

                  <span className="ml-auto text-2xl">💵</span>
                </label>

                {/* Khalti */}
                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${
                    paymentMethod === "khalti"
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="w-5 h-5 accent-purple-600"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Pay with Khalti
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay online using Khalti Sandbox.
                    </p>
                  </div>

                  <span className="ml-auto text-2xl">💜</span>
                </label>
              </div>
            </div>

            {error && (
              <p className="mt-5 p-3 bg-red-50 text-red-600 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-4 rounded-xl transition shadow-md"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "khalti"
                  ? "Continue to Khalti"
                  : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="h-fit bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Order
            </h2>

            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  className="flex items-center gap-3"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <strong className="text-gray-800 whitespace-nowrap">
                    Rs.{" "}
                    {(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 my-6" />

            <div className="flex justify-between items-center mb-3 text-gray-600">
              <span>Total Items</span>

              <span>
                {cartItems.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total Amount</span>

              <span className="text-indigo-600">
                Rs. {subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-5 text-center">
              Thank you for shopping with ShopEase!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
