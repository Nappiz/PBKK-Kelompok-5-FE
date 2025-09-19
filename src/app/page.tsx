import Navbar from "./components/layout/Navbar";
import Hero from "./components/landing/Hero";
import Body from "./components/landing/Body";
import Closing from "./components/landing/Closing";
import Footer from "./components/landing/Footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Body />
      <Closing />
      <Footer />
    </main>
  );
}
