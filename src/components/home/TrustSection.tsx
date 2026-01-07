import { Shield, FileCheck, AlertCircle, Users, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const trustFeatures = [
  {
    icon: FileCheck,
    title: "NIMC Verified",
    description: "All workers have their National Identity verified through NIMC",
  },
  {
    icon: Shield,
    title: "Police Clearance",
    description: "Background checks with Nigerian Police Force verification",
  },
  {
    icon: Users,
    title: "Agency Vetted",
    description: "Many workers come from trusted, registered agencies",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Escrow protection ensures you only pay for completed work",
  },
  {
    icon: Eye,
    title: "Reviewed & Rated",
    description: "Transparent reviews from verified clients",
  },
  {
    icon: AlertCircle,
    title: "24/7 Support",
    description: "Emergency support line available around the clock",
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              Trust & Safety
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Your Family's Safety is Our Priority
            </h2>
            <p className="text-muted-foreground mb-8">
              We understand the importance of inviting someone into your home. That's why every 
              worker on our platform goes through a rigorous verification process before they 
              can accept bookings.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {trustFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button size="lg" className="mt-8" asChild>
              <Link to="/trust-safety">
                Learn More About Our Process
              </Link>
            </Button>
          </div>

          {/* Right Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12">
              {/* Verification Badge Stack */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">NIMC Verified</p>
                    <p className="text-sm text-muted-foreground">Identity confirmed</p>
                  </div>
                  <div className="ml-auto">
                    <span className="trust-badge">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Police Clearance</p>
                    <p className="text-sm text-muted-foreground">No criminal record</p>
                  </div>
                  <div className="ml-auto">
                    <span className="trust-badge">
                      <Shield className="h-3 w-3" />
                      Cleared
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Agency Partner</p>
                    <p className="text-sm text-muted-foreground">Premier Care Agency</p>
                  </div>
                  <div className="ml-auto">
                    <span className="premium-badge">
                      Premium
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
