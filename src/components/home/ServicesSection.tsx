import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import serviceNanny from "@/assets/service-nanny.jpg";
import serviceHousekeeper from "@/assets/service-housekeeper.jpg";
import serviceCleaner from "@/assets/service-cleaner.jpg";
import serviceDriver from "@/assets/service-driver.jpg";
import serviceCaregiver from "@/assets/service-caregiver.jpg";
import serviceTutor from "@/assets/service-tutor.jpg";
import serviceErrand from "@/assets/service-errand.jpg";

const services = [
  {
    id: "nanny",
    title: "Nannies",
    description: "Caring and experienced childcare professionals for your little ones",
    image: serviceNanny,
    color: "from-pink-500/80 to-pink-600/80",
  },
  {
    id: "housekeeper",
    title: "Housekeepers",
    description: "Professional household management and organization",
    image: serviceHousekeeper,
    color: "from-blue-500/80 to-blue-600/80",
  },
  {
    id: "cleaner",
    title: "Cleaners",
    description: "Thorough cleaning services for spotless homes and offices",
    image: serviceCleaner,
    color: "from-purple-500/80 to-purple-600/80",
  },
  {
    id: "driver",
    title: "Drivers",
    description: "Safe and reliable personal and family drivers",
    image: serviceDriver,
    color: "from-green-500/80 to-green-600/80",
  },
  {
    id: "caregiver",
    title: "Caregivers",
    description: "Compassionate care for elderly family members",
    image: serviceCaregiver,
    color: "from-red-500/80 to-red-600/80",
  },
  {
    id: "tutor",
    title: "Home Tutors",
    description: "Qualified educators for personalized home learning",
    image: serviceTutor,
    color: "from-amber-500/80 to-amber-600/80",
  },
  {
    id: "errand",
    title: "Errand Runners",
    description: "Personal assistants for shopping, deliveries, and daily tasks",
    image: serviceErrand,
    color: "from-teal-500/80 to-teal-600/80",
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
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in aspect-[4/3]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:translate-y-0 transition-transform">
                  {service.title}
                </h3>
                <p className="text-sm text-white/90 mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Browse Workers</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
