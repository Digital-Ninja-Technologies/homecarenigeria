import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Percent, Star, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

const promotions = [
  {
    id: 1,
    icon: Gift,
    title: "New User Special",
    description: "Get ₦2,000 off your first booking",
    cta: "Claim Offer",
    link: "/signup/client",
    bgClass: "from-accent/20 via-accent/10 to-transparent",
    accentColor: "text-accent",
  },
  {
    id: 2,
    icon: Percent,
    title: "Weekly Discount",
    description: "Save 15% on weekly bookings this month",
    cta: "Book Now",
    link: "/services",
    bgClass: "from-primary/20 via-primary/10 to-transparent",
    accentColor: "text-primary",
  },
  {
    id: 3,
    icon: Star,
    title: "Premium Workers",
    description: "Access top-rated verified professionals",
    cta: "Explore",
    link: "/services",
    bgClass: "from-secondary/30 via-secondary/15 to-transparent",
    accentColor: "text-secondary-foreground",
  },
  {
    id: 4,
    icon: Clock,
    title: "Same-Day Booking",
    description: "Need help today? Book within 2 hours",
    cta: "Get Started",
    link: "/services",
    bgClass: "from-accent/20 via-accent/10 to-transparent",
    accentColor: "text-accent",
  },
];

const PromotionalBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!isVisible) return null;

  const currentPromo = promotions[currentIndex];
  const Icon = currentPromo.icon;

  return (
    <div
      className="relative bg-card border-b border-border overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-r", currentPromo.bgClass)} />
      
      <div className="container relative py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Promo Content */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={cn("p-2 rounded-full bg-background/80 backdrop-blur-sm", currentPromo.accentColor)}>
              <Icon className="h-4 w-4" />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-semibold text-foreground whitespace-nowrap">
                {currentPromo.title}:
              </span>
              <span className="text-muted-foreground text-sm truncate">
                {currentPromo.description}
              </span>
            </div>
          </div>

          {/* Center: Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>

          {/* Right: CTA and Close */}
          <div className="flex items-center gap-3">
            <Link
              to={currentPromo.link}
              className={cn(
                "hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-colors",
                currentPromo.accentColor,
                "hover:opacity-80"
              )}
            >
              {currentPromo.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{
            width: isPaused ? `${((currentIndex + 1) / promotions.length) * 100}%` : undefined,
            animation: isPaused ? "none" : "progress 5s linear infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PromotionalBanner;
