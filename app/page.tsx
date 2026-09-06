import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import WhyChooseUs from './components/WhyChooseUs';
import OrderingOptions from './components/OrderingOptions';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { JsonLd, OrganizationJsonLd, WebsiteJsonLd } from './components/JsonLd';

// Keep the homepage's structured data (address, phone, logo image, ...) in sync
// with admin-edited site settings without requiring a full redeploy (see
// app/layout.tsx for why this matters).
export const revalidate = 300; // 5 minutes

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
        <OrderingOptions />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
