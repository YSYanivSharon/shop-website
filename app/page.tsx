import Image from "next/image";
import Link from "next/link";

const featuredDucks = [
  { id: 1, name: "Captain Beak", image: "/item-images/1.png", price: "₪25" },
  { id: 2, name: "Duck Norris", image: "/item-images/2.png", price: "₪30" },
  { id: 3, name: "Bubble Quack", image: "/item-images/3.png", price: "₪20" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-10 px-6">
      {/* the biggest header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-yellow-600 mb-4">
          Welcome to Duck World!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
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
        <h2 className="text-2xl font-bold text-center text-yellow-700 mb-6">
          ⭐ Featured Ducks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredDucks.map((duck) => (
            <div
              key={duck.id}
              className="bg-white rounded-2xl shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={duck.image}
                alt={duck.name}
                width={200}
                height={200}
                className="mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-bold text-yellow-800">{duck.name}</h3>
              <p className="text-gray-600 font-semibold">{duck.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
