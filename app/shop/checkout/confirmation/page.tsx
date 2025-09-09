"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmationPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const total = params.get("total");
  const name = params.get("name");
  const country = params.get("country");
  const street = params.get("street");
  const house = params.get("house");

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Order confirmed successfully!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for shopping with us! Your order has been received and will be shipped soon.
      </p>

      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <p className="text-lg">Order Number:</p>
        <p className="text-xl font-bold text-gray-800">{orderId}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p className="text-lg font-bold">Total: ₪{total}</p>
      </div>

      <div className="bg-white shadow rounded-xl p-4 mb-6 text-left">
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <p><span className="font-bold">Name:</span> {name}</p>
        <p><span className="font-bold">Address:</span> {street} {house}</p>
        <p><span className="font-bold">Country:</span> {country}</p>
      </div>

      <a
        href="/shop/user/my-items"
        className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md"
      >
        View My Items
      </a>
    </div>
  );
}
