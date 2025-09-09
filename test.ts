const BASE_URL = "http://localhost:3000";

/*
 * This test the single dynamic path that the store has: the item page.
 * While the page has a dynamic path, because it's client-side, it is sent in the same manner no matter what item is picked.
 * The item is loaded after the client receives the page and then sends an additional request to get the item's details.
 * This means that you can't really test the page using a simple fetch and instead you need to call the server function.
 */

async function testExistingItemPage() {
  const ITEM_ID = 1;
  try {
    const res = await fetch(`${BASE_URL}/shop/item/${ITEM_ID}`);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      const html = await res.text();
      console.log(`Got text/HTML: ${html}`);
    } else {
      console.log(`Got unexpected content type: ${contentType}`);
    }
  } catch (err) {
    console.error(`Fetch failed: ${err}`);
  }
}

// This still loads the page, but the page will display that the item is invalid after fetching it fails
async function testInvalidItemPage() {
  const ITEM_ID = 1000;
  try {
    const res = await fetch(`${BASE_URL}/shop/item/${ITEM_ID}`);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      const html = await res.text();
      console.log(`Got text/HTML: ${html}`);
    } else {
      console.log(`Got unexpected content type: ${contentType}`);
    }
  } catch (err) {
    console.error(`Fetch failed: ${err}`);
  }
}

testExistingItemPage();
testInvalidItemPage();
