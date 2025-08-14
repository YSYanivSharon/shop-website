import Image from "next/image";

const ducks = [
  { id: 1, name: "Classic Quacker", price: "₪20", image: "/item-images/1.png" },
  { id: 2, name: "Doctor Duck", price: "₪30", image: "/item-images/2.png" },
  { id: 3, name: "Pirate Splash", price: "₪35", image: "/item-images/3.png" },
  { id: 4, name: "Business Beak", price: "₪28", image: "/item-images/4.png" },
  { id: 5, name: "Moo Moo Duck", price: "₪32", image: "/item-images/5.png" },
  { id: 6, name: "The Queen Duck", price: "₪27", image: "/item-images/6.png" },
  { id: 7, name: "Superhero Duck", price: "₪29", image: "/item-images/7.png" },
  { id: 8, name: "Zen Duck", price: "₪26", image: "/item-images/8.png" },
  { id: 9, name: "Little Red Quacking Hood", price: "₪27", image: "/item-images/9.png" },
  { id: 10, name: "Boxing Bill", price: "₪25", image: "/item-images/10.png" },
  { id: 11, name: "Teacher Duck", price: "₪32", image: "/item-images/11.png" },
  { id: 12, name: "Pride Duck", price: "₪28", image: "/item-images/12.png" },
];

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">Choose your Duck</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ducks.map((duck) => (
          <div
            key={duck.id}
            className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-200 text-center"
          >
            <Image
              src={duck.image}
              alt={duck.name}
              width={200}
              height={200}
              className="mx-auto mb-3 rounded"
            />
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{duck.name}</h2>
            <p className="text-slate-600 dark:text-slate-300">{duck.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
