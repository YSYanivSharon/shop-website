import Image from "next/image";

const ducks = [
  { id: 1, name: "Classic Quacker", price: 20},
  { id: 2, name: "Doctor Duck", price: 30 },
  { id: 3, name: "Pirate Splash", price: 35 },
  { id: 4, name: "Business Beak", price: 28 },
  { id: 5, name: "Moo Moo Duck", price: 32 },
  { id: 6, name: "The Queen Duck", price: 27 },
  { id: 7, name: "Superhero Duck", price: 29 },
  { id: 8, name: "Zen Duck", price: 26 },
  { id: 9, name: "Little Red Quacking Hood", price: 27 },
  { id: 10, name: "Boxing Bill", price: 25 },
  { id: 11, name: "Teacher Duck", price: 32 },
  { id: 12, name: "Pride Duck", price: 28 },
];

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">Choose your Duck</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ducks.map((duck) => (
          <div
            key={duck.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={`/item-images/${duck.id}.png`}
              alt={duck.name}
              width={200}
              height={200}
              className="mx-auto mb-3 rounded"
            />
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{duck.name}</h2>
            <p className="text-slate-600 dark:text-slate-300">₪{duck.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
