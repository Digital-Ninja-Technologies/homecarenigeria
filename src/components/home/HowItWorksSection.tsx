import { Search, UserCheck, Calendar, CreditCard } from "lucide-react";
const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    description: "Browse verified workers by service type, location, availability, and ratings",
    step: "01",
  },
  {
    icon: UserCheck,
    title: "View Profiles",
    description: "Check detailed profiles with photos, experience, skills, and verified reviews",
    step: "02",
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    description: "Choose one-time, weekly, or monthly bookings that fit your schedule",
    step: "03",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Payment held in escrow until the job is completed to your satisfaction",
    step: "04",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
            Simple Process
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the help you need in four simple steps. We've made it easy and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
                )}
                
                <div className="relative bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-all border border-border/50">
                  {/* Step Number */}
                  <span className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center text-xs font-bold text-white bg-primary rounded-full">
                    {step.step}
                  </span>
                  
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
