import { getListings } from "@/lib/listingsApi";
import { connection } from "next/server";

export default async function ApiTestPage() {
  await connection();

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
