import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CategoryIndex from "@/components/CategoryIndex";
import CategorySection from "@/components/CategorySection";
import ComingSoon from "@/components/ComingSoon";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/data/categories";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <CategoryIndex />
        {CATEGORIES.map((category) => (
          <CategorySection key={category.slug} category={category} />
        ))}
        <ComingSoon />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
