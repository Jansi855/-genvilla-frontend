import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyComparison from "./_components/PropertyComparison";

export const metadata = {
  title: "Property Comparison | GenVilla",
  description:
    "Compare your shortlisted properties by price, space and amenities to find the home that fits your life.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <PropertyComparison />
      <Footer />
    </>
  );
}
