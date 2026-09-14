import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentChecklist from "./_components/DocumentChecklist";

export const metadata = {
  title: "Document Checklist | GenVilla",
  description:
    "Organise buying, selling and renting documents with grouped checklists and locally saved progress.",
};

export default function Page() {
  return (
    <>
      <Navbar />
      <DocumentChecklist />
      <Footer />
    </>
  );
}
