
import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">📦</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Order Information Found
          </h2>

          <p className="text-gray-500 mb-6">
            Please place an order before viewing this page.
          </p>

          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Success Header */}
          <div className="bg-green-50 text-center px-6 py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-5">
              ✓
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Thank You for Your Order!
            </h1>

            <p className="text-gray-600">
              Your order has been placed successfully.
              We appreciate your shopping with ShopEase!
            </p>
          </div>

          <div className="p-6 md:p-8">

            {/* Order Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">
                  Order Status
                </p>
                <p className="font-bold text-gray-800">
                  {order.status}
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Confirmed
              </span>
            </div>

            {/* Order Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Information
              </h2>

              <div className="space-y-3 text-sm md:text-base">
                <div className="flex flex-col sm:flex-row justify-between gap-1">
                  <span className="text-gray-500">Order ID</span>
                  <strong className="text-gray-800 break-all">
                    {order.orderId}
                  </strong>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Order Date</span>
                  <strong className="text-gray-800 text-right">
                    {order.orderDate}
                  </strong>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Payment Method</span>
                  <strong className="text-gray-800">
                    {order.paymentMethod}
                  </strong>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-7" />

            {/* Delivery Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Delivery Information
              </h2>

              <div className="bg-gray-50 rounded-xl p-5 space-y-2">
                <p className="font-bold text-gray-800">
                  {order.customer.name}
                </p>

                <p className="text-gray-600">
                  📞 {order.customer.phone}
                </p>

                <p className="text-gray-600">
                  📍 {order.customer.address}
                </p>

                <p className="text-gray-600">
                  {order.customer.city}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-7" />

            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Order Summary
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    className="flex items-center gap-4"
                    key={item.id}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <strong className="text-gray-800 whitespace-nowrap">
                      Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-5">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount</span>

                  <span className="text-indigo-600">
                    Rs. {order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              to="/"
              className="block text-center w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-md"
            >
              Continue Shopping →
            </Link>

            <p className="text-center text-gray-400 text-sm mt-5">
              Thank you for choosing ShopEase ❤️
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
