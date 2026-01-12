import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Users, 
  BarChart3, 
  Shield, 
  Wallet, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  TrendingUp,
  Headphones
} from "lucide-react";
import heroAgencies from "@/assets/hero-agencies.jpg";
import ctaAgencies from "@/assets/cta-agencies.jpg";
import { useParallax } from "@/hooks/useParallax";
import AgencyTestimonialsCarousel from "@/components/agencies/AgencyTestimonialsCarousel";
import AgencyFAQ from "@/components/agencies/AgencyFAQ";

const benefits = [
  {
    icon: Users,
    title: "Manage Your Team",
    description: "Add and manage all your workers from one centralized dashboard. Track availability, assignments, and performance."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Get detailed insights into your workers' performance, client satisfaction, and revenue trends."
  },
  {
    icon: Shield,
    title: "Priority Verification",
    description: "Fast-track verification for your workers with our dedicated agency verification process."
  },
  {
    icon: Wallet,
    title: "Consolidated Payments",
    description: "Receive payments for all your workers in one place. Easy payroll management and financial tracking."
  },
  {
    icon: Star,
    title: "Featured Listings",
    description: "Get premium placement in search results. Agency-verified workers are preferred by many clients."
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Access priority customer support and a dedicated account manager for your agency."
  },
];

const plans = [
  {
    name: "Starter",
    price: "₦25,000",
    period: "/month",
    description: "Perfect for small agencies",
    features: [
      "Up to 10 workers",
      "Basic analytics dashboard",
      "Standard support",
      "7% platform commission"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "₦75,000",
    period: "/month",
    description: "For growing agencies",
    features: [
      "Up to 50 workers",
      "Advanced analytics",
      "Priority support",
      "5% platform commission",
      "Featured listings",
      "Bulk worker upload"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large agencies",
    features: [
      "Unlimited workers",
      "Custom analytics",
      "Dedicated account manager",
      "Custom commission rates",
      "Premium placement",
      "API access",
      "White-label options"
    ],
    popular: false
  },
];

const stats = [
  { value: "200+", label: "Partner Agencies" },
  { value: "5,000+", label: "Workers Placed" },
  { value: "₦50M+", label: "Monthly Transactions" },
  { value: "4.8/5", label: "Client Satisfaction" },
];

const ForAgencies = () => {
  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>({ speed: 0.15 });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0" ref={parallaxRef}>
            <img
              src={heroAgencies}
              alt="Agency team meeting"
              className="w-full h-full object-cover scale-110 transition-transform duration-100"
              style={parallaxStyle}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                  <Building2 className="h-4 w-4" />
                  For Staffing Agencies
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                  Scale Your Staffing Agency
                </h1>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  Partner with Lagos's leading domestic worker platform. Manage your team, track performance, and grow your business with powerful tools built for agencies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/signup/agency">
                      Register Your Agency
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                    <Link to="/how-it-works">Learn More</Link>
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our agency dashboard gives you the tools to manage workers, track performance, and grow your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Agency Subscription Plans
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose a plan that fits your agency size. All plans include access to our platform and tools.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div key={index} className={`bg-card rounded-2xl p-6 border-2 ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} relative`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link to="/signup/agency">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency Testimonials */}
        <AgencyTestimonialsCarousel />

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                  How Agency Partnership Works
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Register Your Agency",
                      description: "Create your agency profile with business documents and verification."
                    },
                    {
                      step: 2,
                      title: "Add Your Workers",
                      description: "Upload your worker profiles with their skills, experience, and documents."
                    },
                    {
                      step: 3,
                      title: "Receive Bookings",
                      description: "Clients book your workers directly. Assign jobs to available team members."
                    },
                    {
                      step: 4,
                      title: "Track & Get Paid",
                      description: "Monitor performance and receive consolidated payments for your team."
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Agency Dashboard Preview</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Total Workers</span>
                      <span className="text-lg font-bold text-primary">24</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-2 bg-primary rounded-full w-3/4" />
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Active Bookings</span>
                      <span className="text-lg font-bold text-accent">18</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-2 bg-accent rounded-full w-2/3" />
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">This Month's Revenue</span>
                      <span className="text-lg font-bold text-foreground">₦1.2M</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div className="h-2 bg-primary rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <AgencyFAQ />

        {/* CTA Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Fixed Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${ctaAgencies})` }}
          />
          <div className="absolute inset-0 bg-primary/90" />
          <div className="container relative text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Grow Your Agency?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join 200+ agencies already partnering with HomeCare Connect. Get started today.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup/agency">
                Register Your Agency
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

export default ForAgencies;
