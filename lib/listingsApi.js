const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getListings() {
  try {
    const response = await fetch(
      `${API_URL}/api/listings?sort=newest&page=1&limit=12`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();

    return data.items || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}