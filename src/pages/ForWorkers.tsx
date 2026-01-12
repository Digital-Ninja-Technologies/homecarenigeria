import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Wallet, 
  Clock, 
  Shield, 
  TrendingUp, 
  Star, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Briefcase,
  MapPin,
  Calendar
} from "lucide-react";
import heroWorkers from "@/assets/hero-workers.jpg";

const benefits = [
  {
    icon: Wallet,
    title: "Competitive Earnings",
    description: "Set your own rates and earn what you deserve. Our transparent pricing means you keep more of what you earn."
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work when you want, where you want. Accept jobs that fit your schedule and availability."
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Get paid on time, every time. Our escrow system ensures you receive payment for completed work."
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Build your reputation through ratings and reviews. Top-rated workers get more visibility and higher-paying jobs."
  },
  {
    icon: Star,
    title: "Build Your Brand",
    description: "Create a professional profile that showcases your skills, experience, and certifications."
  },
  {
    icon: Users,
    title: "Growing Network",
    description: "Connect with families and businesses across Lagos. Build long-term relationships with repeat clients."
  },
];

const steps = [
  {
    step: 1,
    title: "Create Your Profile",
    description: "Sign up and build your professional profile with your skills, experience, and availability."
  },
  {
    step: 2,
    title: "Get Verified",
    description: "Upload your NIMC ID and police clearance certificate. Verified workers get more bookings."
  },
  {
    step: 3,
    title: "Receive Job Requests",
    description: "Get matched with clients looking for your services. Accept jobs that fit your schedule."
  },
  {
    step: 4,
    title: "Work & Get Paid",
    description: "Complete the job and receive secure payment directly to your bank account or wallet."
  },
];

const categories = [
  { icon: Users, title: "Nannies & Childcare" },
  { icon: Briefcase, title: "Housekeepers" },
  { icon: MapPin, title: "Drivers" },
  { icon: Calendar, title: "Elderly Caregivers" },
  { icon: Star, title: "Home Tutors" },
  { icon: CheckCircle2, title: "Cleaners" },
];

const ForWorkers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroWorkers}
              alt="Successful domestic worker"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/95 via-accent/85 to-accent/75" />
          </div>
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                  Join 5,000+ Workers
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Turn Your Skills Into Income
                </h1>
                <p className="text-lg text-white/80 mb-8">
                  Join Nigeria's most trusted platform for domestic workers. Set your own rates, choose your schedule, and connect with families across Lagos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/signup/worker">
                      Start Earning Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10" asChild>
                    <Link to="/how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat, index) => (
                      <div key={index} className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
                        <cat.icon className="h-5 w-5 text-white" />
                        <span className="text-sm font-medium text-white">{cat.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Why Work With HomeCare Connect?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide everything you need to build a successful career as a domestic worker.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Getting Started is Easy
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four simple steps to start earning with HomeCare Connect.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-card rounded-xl p-6 border border-border h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  What You Need to Join
                </h2>
                <p className="text-muted-foreground mb-8">
                  To maintain the highest standards of trust and safety, we require the following from all workers:
                </p>
                <ul className="space-y-4">
                  {[
                    "Valid NIMC National ID or NIN Slip",
                    "Police clearance certificate (within 6 months)",
                    "Proof of residence in Lagos",
                    "Professional references (optional but recommended)",
                    "Relevant certifications for specialized roles"
                  ].map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Earnings Potential</h3>
                <div className="space-y-4">
                  {[
                    { role: "Nanny (Live-out)", range: "₦80,000 - ₦150,000/month" },
                    { role: "Housekeeper", range: "₦60,000 - ₦120,000/month" },
                    { role: "Driver", range: "₦100,000 - ₦180,000/month" },
                    { role: "Home Tutor", range: "₦5,000 - ₦15,000/hour" },
                    { role: "Cleaner (One-time)", range: "₦8,000 - ₦25,000/visit" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-foreground font-medium">{item.role}</span>
                      <span className="text-accent font-semibold">{item.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-accent">
          <div className="container text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of workers already earning with HomeCare Connect. Sign up takes just 5 minutes.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup/worker">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForWorkers;
