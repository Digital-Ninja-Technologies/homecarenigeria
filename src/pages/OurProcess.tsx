import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Shield, UserCheck, FileSearch, BadgeCheck, Clock, 
  CreditCard, MessageCircle, Star, CheckCircle2, Users,
  Fingerprint, FileText, Phone, MapPin, Award, HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useParallax } from "@/hooks/useParallax";

const vettingSteps = [
  {
    icon: Fingerprint,
    title: "Identity Verification",
    description: "Every worker submits their National Identification Number (NIN) for NIMC verification to confirm their identity."
  },
  {
    icon: FileSearch,
    title: "Background Check",
    description: "We conduct thorough police background checks to ensure workers have clean records and can be trusted in your home."
  },
  {
    icon: FileText,
    title: "Document Review",
    description: "Professional certifications, references, and work history are verified by our team before approval."
  },
  {
    icon: Phone,
    title: "Phone Interview",
    description: "Our team conducts phone interviews to assess communication skills and professionalism."
  },
];

const clientJourney = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up in minutes with your email or phone number. Tell us about your household needs.",
    icon: Users
  },
  {
    step: "02",
    title: "Search & Filter",
    description: "Browse verified workers by service type, location (Lekki, VI, Ikeja, etc.), availability, and ratings.",
    icon: MapPin
  },
  {
    step: "03",
    title: "Review Profiles",
    description: "View detailed profiles with experience, skills, languages, verification badges, and client reviews.",
    icon: UserCheck
  },
  {
    step: "04",
    title: "Book & Pay",
    description: "Select your dates and times, then pay securely. Your money is held in escrow until job completion.",
    icon: CreditCard
  },
  {
    step: "05",
    title: "Get Service",
    description: "Your worker arrives as scheduled. Communicate directly through the app for any needs.",
    icon: HeartHandshake
  },
  {
    step: "06",
    title: "Review & Repeat",
    description: "Rate your experience and book again with your favorite workers or try someone new.",
    icon: Star
  },
];

const workerJourney = [
  {
    step: "01",
    title: "Apply Online",
    description: "Submit your application with personal details, work experience, and service offerings."
  },
  {
    step: "02",
    title: "Upload Documents",
    description: "Provide your NIN, police clearance certificate, and any professional certifications."
  },
  {
    step: "03",
    title: "Verification Review",
    description: "Our team reviews your documents and conducts background checks (typically 2-3 business days)."
  },
  {
    step: "04",
    title: "Profile Activation",
    description: "Once approved, your profile goes live and you can start receiving booking requests."
  },
  {
    step: "05",
    title: "Accept Bookings",
    description: "Review and accept job requests that match your schedule and preferences."
  },
  {
    step: "06",
    title: "Get Paid",
    description: "Complete jobs and receive payments directly to your wallet. Withdraw anytime."
  },
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Escrow Protection",
    description: "Client payments are held securely and only released after confirmed job completion.",
    highlight: "100% Secure"
  },
  {
    icon: BadgeCheck,
    title: "Verified Badges",
    description: "Look for NIMC and Police verification badges on worker profiles for peace of mind.",
    highlight: "Trust Indicators"
  },
  {
    icon: MessageCircle,
    title: "In-App Messaging",
    description: "Communicate directly with workers before and during bookings without sharing personal numbers.",
    highlight: "Privacy First"
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "Not satisfied? We'll help resolve issues or find a replacement at no extra cost.",
    highlight: "Risk-Free"
  },
];

const OurProcess = () => {
  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>({ speed: 0.15 });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="container relative text-center">
            <span className="inline-block px-4 py-1.5 bg-primary-foreground/10 rounded-full text-primary-foreground/80 text-sm font-medium mb-4">
              Trust & Transparency
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Process: Safety First
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Learn how we vet every worker, protect every transaction, and ensure every booking 
              is a positive experience for both families and service providers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup/client">Get Started as Client</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link to="/for-workers">Join as Worker</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Vetting Process Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                Worker Verification
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                How We Vet Every Worker
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Before any worker appears on our platform, they go through a rigorous 4-step verification process.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vettingSteps.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="bg-card rounded-2xl p-6 border border-border h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="text-3xl font-bold text-primary/10">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-accent/10 rounded-2xl p-6 md:p-8 border border-accent/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Only 35% Pass Our Screening</h3>
                  <p className="text-muted-foreground">
                    We maintain high standards. Out of every 100 applicants, only about 35 meet our requirements for 
                    identity verification, background checks, and professional qualifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Journey Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                For Families
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Your Journey as a Client
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From signup to service completion, here's what to expect when you use HomeCare Connect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clientJourney.map((item, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold text-primary/20">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Worker Journey Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                For Service Providers
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Your Journey as a Worker
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our community of verified professionals and connect with families across Lagos.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
              
              <div className="space-y-8">
                {workerJourney.map((item, index) => (
                  <div key={index} className={`flex flex-col md:flex-row gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`bg-card rounded-xl p-6 border border-border inline-block ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} max-w-md hover:shadow-lg transition-shadow`}>
                        <span className="text-sm font-bold text-primary mb-1 block">Step {item.step}</span>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                    </div>
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                Trust & Safety
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Your Protection is Our Priority
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We've built multiple layers of protection to ensure safe, secure transactions for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border flex gap-4 hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Preview Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Common Questions
                </h2>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    q: "How long does worker verification take?",
                    a: "Our verification process typically takes 2-3 business days once all required documents are submitted."
                  },
                  {
                    q: "What happens if I'm not satisfied with a worker?",
                    a: "Contact our support team within 24 hours. We'll help resolve the issue or find you a replacement at no extra cost."
                  },
                  {
                    q: "How do payments work?",
                    a: "Payments are held in escrow when you book. The worker receives payment only after you confirm the job is complete."
                  },
                  {
                    q: "Can I book the same worker again?",
                    a: "Absolutely! You can add workers to your favorites and book them directly for future services."
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-card rounded-xl p-5 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of Lagos families and workers who trust HomeCare Connect every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/services">Find a Worker</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link to="/for-workers">Become a Worker</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default OurProcess;
