import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, Calendar, Shield, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Wallet, text: "Earn competitive pay" },
  { icon: Calendar, text: "Flexible schedule" },
  { icon: Shield, text: "Secure payments" },
  { icon: TrendingUp, text: "Grow your career" },
];

const WorkerCTASection = () => {
  return (
    <section className="py-16 md:py-24 hero-gradient relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - For Workers */}
          <div className="text-white text-center lg:text-left">
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              For Domestic Workers
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Join Our Network of Trusted Professionals
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto lg:mx-0">
              Get verified, build your reputation, and connect with families 
              looking for reliable help. Take control of your career.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto lg:mx-0">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-2 text-white/90 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-5 w-5 text-accent" />
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/signup/worker">
                Start Earning Today
              </Link>
            </Button>
          </div>

          {/* Right - For Agencies */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/20 text-white text-center lg:text-left">
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              For Agencies
            </span>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              Manage Your Team, Grow Your Business
            </h3>
            <p className="text-white/80 mb-6">
              Partner with us to reach more clients, manage your workers efficiently, 
              and streamline your operations with our agency dashboard.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Add and manage multiple workers
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Track performance and payments
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Get priority placement in search
              </li>
            </ul>

            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/signup/agency">
                Register Your Agency
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkerCTASection;
