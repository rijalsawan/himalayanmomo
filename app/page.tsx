import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { JsonLd, OrganizationJsonLd, WebsiteJsonLd } from './components/JsonLd';

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <JsonLd type="restaurant" />
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      
      <main className="min-h-screen bg-[#FDF8F3]">
        <Navbar />
        <Hero />
        <About />
        <MenuSection />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
