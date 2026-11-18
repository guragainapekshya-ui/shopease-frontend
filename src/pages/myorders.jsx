
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ORDER_API = `${API_BASE_URL}/api/orders/`;
const PRODUCT_API = `${API_BASE_URL}/api/products/`;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Please log in to view your orders.");
    }

    const response = await fetch(ORDER_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Unable to load your orders. Please log in again.");
    }

    const data = await response.json();
    setOrders(Array.isArray(data) ? data : data.results || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [_, productResponse] = await Promise.all([
          fetchOrders(),
          fetch(PRODUCT_API),
        ]);

        if (!productResponse.ok) {
          throw new Error("Unable to load product information.");
        }

        const productData = await productResponse.json();
        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.results || []
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelingId(orderId);
      setMessage("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${ORDER_API}${orderId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Unable to cancel this order.");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId ? data : order
        )
      );

      setMessage(`Order #${orderId} cancelled successfully.`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCancelingId(null);
    }
  };

  const getProduct = (productId) =>
    products.find((product) => Number(product.id) === Number(productId));

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "Date unavailable";

  const getImage = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-indigo-600">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Unable to Load Orders
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link to="/" className="text-indigo-600 font-semibold">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              My Orders
            </h1>
            <p className="text-gray-500 mt-2">
              Track and view your previous purchases.
            </p>
          </div>

          <Link to="/" className="text-indigo-600 font-semibold">
            ← Continue Shopping
          </Link>
        </div>

        {message && (
          <p className="mb-5 p-3 rounded-lg bg-indigo-50 text-indigo-700">
            {message}
          </p>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-7xl mb-5">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Orders Yet!
            </h2>
            <p className="text-gray-500 mb-7">
              You haven't placed any orders yet.
            </p>
            <Link to="/" className="bg-indigo-600 text-white px-7 py-3 rounded-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-gray-50 p-5 md:p-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <span className={`self-start px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                    order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="p-5 md:p-6 space-y-5">
                  {order.items.map((item) => {
                    const product = getProduct(item.product);
                    const price = Number(item.unit_price);

                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {product?.image ? (
                          <img
                            src={getImage(product.image)}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
                            📦
                          </div>
                        )}

                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">
                            {product?.name || `Product #${item.product}`}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rs. {formatPrice(price)} each
                          </p>
                        </div>

                        <strong className="text-gray-800">
                          Rs. {formatPrice(price * item.quantity)}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-6 flex flex-col sm:flex-row justify-between gap-5">
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Payment:</strong> Cash on Delivery</p>
                    <p><strong>Delivery:</strong> {order.city || "Not provided"}</p>
                    <p><strong>Address:</strong> {order.address || "Not provided"}</p>
                    <p><strong>Phone:</strong> {order.phone || "Not provided"}</p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">
                      Rs. {formatPrice(order.total_amount)}
                    </p>

                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancelingId === order.id}
                        className="mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-lg transition"
                      >
                        {cancelingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
