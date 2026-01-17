import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import serviceNanny from "@/assets/service-nanny.jpg";
import serviceHousekeeper from "@/assets/service-housekeeper.jpg";
import serviceCleaner from "@/assets/service-cleaner.jpg";
import serviceDriver from "@/assets/service-driver.jpg";
import serviceCaregiver from "@/assets/service-caregiver.jpg";
import serviceTutor from "@/assets/service-tutor.jpg";
import serviceErrand from "@/assets/service-errand.jpg";
import advertAgencies from "@/assets/advert-agencies.jpg";
import advertWorkers from "@/assets/advert-workers.jpg";
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

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => (
  <Link
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
);

const AdvertCard = ({ variant }: { variant: "left" | "right" }) => (
  <div className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in aspect-[4/3]">
    {/* Background Image */}
    <img
      src={variant === "left" ? advertAgencies : advertWorkers}
      alt={variant === "left" ? "Partner with us" : "Start earning"}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40 group-hover:from-primary/90 group-hover:via-primary/60 transition-all duration-300" />
    
    {/* Content */}
    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
      {variant === "left" ? (
        <>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-3">
              For Agencies
            </span>
            <h3 className="text-xl font-bold mb-2">Partner With Us</h3>
            <p className="text-sm text-white/90">
              List your workers on our platform and reach thousands of clients in Lagos.
            </p>
          </div>
          <Link
            to="/for-agencies"
            className="inline-flex items-center text-sm font-semibold text-accent hover:text-white transition-colors group-hover:translate-x-1 duration-300"
          >
            Learn More <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </>
      ) : (
        <>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent/40 backdrop-blur-sm text-xs font-medium mb-3">
              For Workers
            </span>
            <h3 className="text-xl font-bold mb-2">Start Earning Today</h3>
            <p className="text-sm text-white/90">
              Join our network of verified professionals and connect with families.
            </p>
          </div>
          <Link
            to="/for-workers"
            className="inline-flex items-center text-sm font-semibold text-accent hover:text-white transition-colors group-hover:translate-x-1 duration-300"
          >
            Sign Up Now <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </>
      )}
    </div>
  </div>
);

const ServicesSection = () => {
  // Split services: first 3, middle 1, last 3
  const topRow = services.slice(0, 3);
  const middleService = services[3]; // Driver
  const bottomRow = services.slice(4, 7);

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

        {/* Top Row - 3 Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {topRow.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Middle Row - Advert + 1 Service + Advert */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <AdvertCard variant="left" />
          <ServiceCard service={middleService} index={3} />
          <AdvertCard variant="right" />
        </div>

        {/* Bottom Row - 3 Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {bottomRow.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index + 4} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
