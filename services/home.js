import { insights, schemes } from "@/data/home";

export async function getHomeData(city) {
  const cityMap = {
    Gurugram: "Gurgaon",
    Ghaziabad: "Ghaziabad",
    Sonipat: "Sonipat",
    Noida: "Noida",
    "New Delhi": "New Delhi",
  };

  const apiCity = cityMap[city] || city;

  const params = new URLSearchParams({
    sort: "newest",
    page: "1",
    limit: "12",
  });

  if (apiCity) {
    params.set("city", apiCity);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/listings?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch home properties: ${response.status}`
      );
    }

    const data = await response.json();

    const featuredProperties = (data.items || []).map((property) => {
      const priceValue = property.price_paise
        ? property.price_paise / 100
        : 0;

      return {
        id: property.id,

        title:
          property.project_name ||
          property.title ||
          "Property",

        city: property.city || "",

        locality: property.locality || "",

        location:
          property.address ||
          `${property.locality || ""}${
            property.city ? `, ${property.city}` : ""
          }`,

        type: property.property_type || "",

        purpose:
          property.transaction_type === "Rent"
            ? "Rent"
            : "Buy",

        bhk: property.bedrooms
          ? String(property.bedrooms)
          : "",

        area:
          property.builtup_area_sqft ||
          property.carpet_area_sqft ||
          0,

        areaValue:
          property.builtup_area_sqft ||
          property.carpet_area_sqft ||
          0,

        priceValue,

        price: formatIndianPrice(priceValue),

        image:
          property.image_url ||
          "/properties/property-placeholder.jpg",

        risk: "—",

        roi: "—",

        roiValue: 0,
      };
    });

    return {
      featuredProperties,
      insights,
      schemes,
      demo: false,
    };
  } catch (error) {
    console.error("Home API Error:", error);

    return {
      featuredProperties: [],
      insights,
      schemes,
      demo: false,
    };
  }
}

function formatIndianPrice(amount) {
  const value = Number(amount);

  if (!value) {
    return "Price on request";
  }

  if (value >= 10000000) {
    const crore = value / 10000000;

    return `₹${Number(crore.toFixed(2))} Cr`;
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return `₹${Number(lakh.toFixed(2))} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}