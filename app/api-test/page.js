import { getListings } from "@/lib/listingsApi";

export default async function ApiTestPage() {
  const properties = await getListings();

  return (
    <div style={{ padding: "30px" }}>
      <h1>API Test</h1>

      <p>Total properties received: {properties.length}</p>

      <pre>
        {JSON.stringify(properties.slice(0, 2), null, 2)}
      </pre>
    </div>
  );
}