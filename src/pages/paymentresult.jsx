import { Link, useLocation } from "react-router-dom";

function PaymentResult() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const paymentStatus = params.get("status");
  const orderId = params.get("order_id");

  const isSuccess = paymentStatus === "success";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-5">
          {isSuccess ? "✅" : "❌"}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        <p className="text-gray-600 mb-4">
          {isSuccess
            ? "Your Khalti payment was completed successfully."
            : "Your payment could not be completed. Please try again."}
        </p>

        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
        )}

        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default PaymentResult;