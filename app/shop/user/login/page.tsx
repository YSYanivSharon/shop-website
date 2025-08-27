"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login } from "@/app/components/user-provider";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await login(email, password);

    if (user) {
      setMessage("Login successful!");
      setTimeout(() => router.back(), 1000);
    } else {
      setMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 w-full max-w-md mt-20 border border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold text-center text-yellow-500 mb-3">
            Welcome Back!
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Login to your Duck World account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Login
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 text-sm font-medium text-red-500 dark:text-red-400">
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/shop/user/signup"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
