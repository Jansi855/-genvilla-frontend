export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      return Response.json(
        { error: "NEXT_PUBLIC_API_URL is not configured" },
        { status: 500 }
      );
    }

    const apiUrl = `${baseUrl}/api/listings?${searchParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        {
          error: "Failed to fetch listings",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Proxy Listings API Error:", error);

    return Response.json(
      {
        error: "Unable to fetch listings",
      },
      { status: 500 }
    );
  }
}