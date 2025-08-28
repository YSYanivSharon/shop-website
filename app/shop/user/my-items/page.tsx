import { getPurchaseHistory } from "@/lib/persist-module";

export default async function Page() {
  const purchases = await getPurchaseHistory();
  return <div>This is the "my items" page</div>;
}
