import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CollectionIndex from "@/components/CollectionIndex";
import ComingSoon from "@/components/ComingSoon";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <CollectionIndex />
        <ComingSoon />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
