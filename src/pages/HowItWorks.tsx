import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, UserCheck, Calendar, Star, Shield, Clock, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroHowItWorks from "@/assets/hero-how-it-works.jpg";

const steps = [
  {
    icon: Search,
    title: "Search & Browse",
    description: "Browse verified workers by service type, location, availability, and ratings. Use filters to find the perfect match for your needs.",
    details: ["Filter by Lekki, VI, Ikeja, Ajah & more", "Compare ratings and reviews", "View detailed worker profiles"]
  },
  {
    icon: UserCheck,
    title: "Review & Select",
    description: "View detailed profiles including experience, skills, languages spoken, and verification status. Read reviews from other clients.",
    details: ["NIMC verified identity", "Police clearance checked", "Agency or independent status"]
  },
  {
    icon: Calendar,
    title: "Book & Schedule",
    description: "Choose one-time, weekly, or monthly booking options. Select your preferred dates and times that work for your schedule.",
    details: ["Flexible scheduling options", "Instant booking confirmation", "Easy rescheduling if needed"]
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Pay through our secure escrow system. Your payment is held safely until the job is completed to your satisfaction.",
    details: ["Card, bank transfer, or wallet", "Money-back guarantee", "Secure escrow protection"]
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Workers",
    description: "All workers undergo NIMC identity verification and police background checks before joining our platform."
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description: "Book for one-time help, weekly recurring service, or monthly arrangements that suit your household needs."
  },
  {
    icon: CreditCard,
    title: "Escrow Payments",
    description: "Your payment is held securely and only released to the worker after you confirm job completion."
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Chat directly with workers before and during bookings to discuss requirements and expectations."
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Read honest reviews from other clients and leave your own feedback to help the community."
  },
  {
    icon: UserCheck,
    title: "Quality Guarantee",
    description: "Not satisfied? We'll help resolve issues or find you a replacement worker at no extra cost."
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroHowItWorks}
              alt="Family welcoming a domestic worker"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75" />
          </div>
          
          <div className="container relative text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              How HomeCare Connect Works
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Finding trusted domestic help in Lagos has never been easier. Our simple 4-step process connects you with verified workers in minutes.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  
                  <div className="bg-card rounded-2xl p-6 border border-border h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="text-4xl font-bold text-primary/20">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose HomeCare Connect?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've built every feature with your safety, convenience, and peace of mind in mind.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Perfect Helper?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of Lagos families who trust HomeCare Connect for their domestic staffing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">Browse Workers</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link to="/signup/client">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
