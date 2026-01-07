import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TrustSection from "@/components/home/TrustSection";
import FeaturedWorkersSection from "@/components/home/FeaturedWorkersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WorkerCTASection from "@/components/home/WorkerCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <FeaturedWorkersSection />
        <HowItWorksSection />
        <TrustSection />
        <TestimonialsSection />
        <WorkerCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
