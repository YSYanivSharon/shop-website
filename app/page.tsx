import Image from "next/image";
import Link from "next/link";

const featuredDucks = [
  { id: 1, name: "Classic Quacker", image: "/item-images/1.png", price: "₪20" },
  { id: 2, name: "Doctor Duck", image: "/item-images/2.png", price: "₪30" },
  { id: 3, name: "Boxing Bill", image: "/item-images/10.png", price: "₪25" },
];

export default function HomePage() {
  return (
    <main className="flex-1 py-10 px-6">
      {/* the biggest header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-4">
          Welcome to Duck World!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Discover the most special ducks on the web.
        </p>
        <Link href="/shop/catalog">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition">
            Browse Catalog
          </button>
        </Link>
      </section>

      {/* selected ducks */}
      <section>
        <h2 className="text-2xl font-bold text-center text-yellow-700 dark:text-yellow-300 mb-6">
          ⭐ Featured Ducks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredDucks.map((duck) => (
            <div
              key={duck.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={duck.image}
                alt={duck.name}
                width={200}
                height={200}
                className="mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-bold text-yellow-800 dark:text-yellow-300">{duck.name}</h3>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">{duck.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
