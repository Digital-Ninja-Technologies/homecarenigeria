import { Link } from "react-router-dom";
import { Baby, Home, Sparkles, Car, Heart, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    id: "nanny",
    title: "Nannies",
    description: "Caring and experienced childcare professionals for your little ones",
    icon: Baby,
    color: "bg-pink-50 text-pink-600",
    iconBg: "bg-pink-100",
  },
  {
    id: "housekeeper",
    title: "Housekeepers",
    description: "Professional household management and organization",
    icon: Home,
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: "cleaner",
    title: "Cleaners",
    description: "Thorough cleaning services for spotless homes and offices",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    id: "driver",
    title: "Drivers",
    description: "Safe and reliable personal and family drivers",
    icon: Car,
    color: "bg-green-50 text-green-600",
    iconBg: "bg-green-100",
  },
  {
    id: "caregiver",
    title: "Caregivers",
    description: "Compassionate care for elderly family members",
    icon: Heart,
    color: "bg-red-50 text-red-600",
    iconBg: "bg-red-100",
  },
  {
    id: "tutor",
    title: "Home Tutors",
    description: "Qualified educators for personalized home learning",
    icon: GraduationCap,
    color: "bg-amber-50 text-amber-600",
    iconBg: "bg-amber-100",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Find the Right Help
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our categories of verified domestic workers. All professionals 
            are background-checked and reviewed by our community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${service.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${service.color.split(" ")[1]}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse Workers</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
