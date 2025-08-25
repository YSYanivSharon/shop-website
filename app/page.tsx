import Link from "next/link";
import { getShopItem } from "@/lib/persist-module";
import { getImageOfItem } from "./components/item-images";

export default async function HomePage() {
  const featuredDucksIds: number[] = [1, 2, 10];
  const featuredDucks = [];
  for (var id of featuredDucksIds) {
    featuredDucks.push(await getShopItem(id));
  }
  return (
    <main className="flex-1 py-10 px-6">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Welcome to Duck World!
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
          Discover the most special ducks on the web.
        </p>
        <Link href="/shop/catalog">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition">
            Browse Catalog
          </button>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center text-yellow-700 dark:text-yellow-300 mb-6">
          ⭐ Featured Ducks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredDucks.map((duck) => (
            <Link
              href={`/shop/item/${duck.id}`}
              key={duck.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
            >
              {getImageOfItem(duck)}
              <h3 className="mt-4 text-lg font-bold text-yellow-800 dark:text-yellow-300">
                {duck.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                ₪{duck.price}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
