"use client";
import { useState } from "react";

export default function Page() {
  return (
    <main dir="ltr" className="mx-auto max-w-6xl px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Contact Us
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
          We’d love to hear from you. Choose one of the options below.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-8 min-h-[240px] flex flex-col hover:scale-105 transition-transform duration-300">
          <div className="mb-4 flex items-center gap-3">
            <ChatIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-xl font-semibold">Live chat (להשלים)</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-7">
            Talk to an agent in real time.
          </p>
          <button
            className="mt-auto inline-flex justify-center rounded-full px-5 py-2 font-semibold bg-yellow-400 hover:bg-yellow-500 text-white transition"
          >
            Start Chat
          </button>
        </div>

        <div className="group rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-8 min-h-[240px] flex flex-col hover:scale-105 transition-transform duration-300">
          <div className="mb-4 flex items-center gap-3">
            <MailIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-xl font-semibold">Email us</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-7">
            We try to reply within 48 hours.
          </p>
          <a
            href="mailto:hello@duckworld.example"
            className="mt-auto inline-flex justify-center rounded-full px-5 py-2 font-semibold border hover:shadow"
          >
            hello@duckworld.mail
          </a>
        </div>

        <div className="group rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-8 min-h-[240px] flex flex-col hover:scale-105 transition-transform duration-300">
          <div className="mb-4 flex items-center gap-3">
            <PhoneIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-xl font-semibold">Customer support</h2>
          </div>
          <div className="text-gray-600 dark:text-gray-300 leading-7">
            <div>
              <span> Telephone: </span>
              <a
                className="no-underline hover:text-yellow-600 transition"
                href="tel:+972500000000"
              >
                050-000-0000
              </a>
            </div>
            <div>Sun–Thu 09:00–18:00, Fri 09:00–13:00</div>
          </div>
        </div>
      </section>

      <section className="mt-0 flex justify-center">
        <img
          src="/item-images/ducks.png"
          alt="Row of ducks"
          className="w-[800px] h-[350px] object-contain"
        />
      </section>
    </main>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" d="M4 6h16v12H4z" />
      <path strokeWidth="2" d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeWidth="2"
        d="M6 2h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2A18 18 0 0 1 4 6c0-1 1-2 2-2z"
      />
    </svg>
  );
}

function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" d="M3 5h18v10H7l-4 4V5z" />
      <path strokeWidth="2" d="M8 9h8M8 12h5" />
    </svg>
  );
}
