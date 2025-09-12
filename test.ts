const BASE_URL = "http://localhost:3000";

/*
 * This test the single dynamic path that the store has: the item page.
 * While the page has a dynamic path, because it's client-side, it is sent in the same manner no matter what item is picked.
 * The item is loaded after the client receives the page and then sends an additional request to get the item's details.
 * This means that you can't really test the page using a simple fetch and instead you need to call the server function.
 */

async function runTest(description: string, func: () => Promise<boolean>) {
  var passed = false;
  try {
    passed = await func();
  } catch (err) {}

  console.log(`${description}: ${passed ? "passed" : "failed"}`);
}

async function testExistingItemPage() {
  const ITEM_ID = 1;
  try {
    const res = await fetch(`${BASE_URL}/shop/item/${ITEM_ID}`);
    if (!res.ok) {
      return false;
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      const html = await res.text();
      return html.length > 0;
    }
  } catch (err) {}
  return false;
}

// This still loads the page, but the page will display that the item is invalid after fetching it fails
async function testInvalidItemPage() {
  const ITEM_ID = 1000;
  try {
    const res = await fetch(`${BASE_URL}/shop/item/${ITEM_ID}`);
    if (!res.ok) {
      return false;
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      const html = await res.text();
      return html.length > 0;
    }
  } catch (err) {}
  return false;
}

runTest("Testing the fetching of an existing shop item", testExistingItemPage);
runTest("Testing the fetching of an invalid shop item", testInvalidItemPage);
