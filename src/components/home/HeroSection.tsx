import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Shield, Star, Users, ChevronDown, Baby, Home, Sparkles, Car, Heart, GraduationCap, MapPin, Check, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import heroFamily from "@/assets/hero-family.jpg";
import { useParallax } from "@/hooks/useParallax";

const services = [
  { name: "Nanny", icon: Baby },
  { name: "Housekeeper", icon: Home },
  { name: "Cleaner", icon: Sparkles },
  { name: "Driver", icon: Car },
  { name: "Caregiver", icon: Heart },
  { name: "Home Tutor", icon: GraduationCap },
  { name: "Errand Runner", icon: ShoppingBag },
];
const locations = ["Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Surulere", "Yaba", "Ajah"];

const HeroSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>({ speed: 0.15 });
  
  const serviceRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedServiceData = services.find(s => s.name === selectedService);
  
  return (
    <section className="relative py-16 md:py-24 lg:py-32">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0" ref={parallaxRef}>
        <img
          src={heroFamily}
          alt="Happy Nigerian family with their trusted caregiver"
          className="w-full h-full object-cover scale-110 transition-transform duration-100"
          style={parallaxStyle}
        />
      </div>
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/40" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Verified & Background-Checked Workers</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-6 animate-fade-in" style={{
              animationDelay: "0.1s"
            }}>
              Find Trusted Help
              <br />
              <span className="text-accent">For Your Home</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl animate-fade-in" style={{
              animationDelay: "0.2s"
            }}>
              Connect with verified nannies, housekeepers, drivers, and caregivers in Lagos. 
              Background-checked, reviewed, and ready to help.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md animate-fade-in" style={{
              animationDelay: "0.4s"
            }}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                  <span>5K+</span>
                </div>
                <p className="text-xs md:text-sm text-white/70 mt-1">Verified Workers</p>
              </div>
              <div className="text-center border-x border-white/20 text-secondary-foreground">
                <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-premium" />
                  <span className="text-primary-foreground">4.8</span>
                </div>
                <p className="text-xs md:text-sm text-white/70 mt-1">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  <span>100%</span>
                </div>
                <p className="text-xs md:text-sm text-white/70 mt-1">Verified</p>
              </div>
            </div>
          </div>

          {/* Right Column - Search Box */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-2xl border border-white/20">
              <h2 className="text-lg font-semibold text-foreground mb-4">Find the perfect help</h2>
              
              <div className="flex flex-col gap-3">
                {/* Service Dropdown */}
                <div className="relative" ref={serviceRef}>
                  <button 
                    onClick={() => {
                      setShowServiceDropdown(!showServiceDropdown);
                      setShowLocationDropdown(false);
                    }} 
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-secondary/80 text-left text-foreground hover:bg-secondary transition-all duration-200 group border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                      {selectedServiceData ? <selectedServiceData.icon className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Service</span>
                      <p className={`text-sm font-semibold truncate ${selectedService ? "text-foreground" : "text-muted-foreground"}`}>
                        {selectedService || "What do you need?"}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showServiceDropdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {/* Service Dropdown Menu */}
                  <div className={`absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border z-50 overflow-hidden transition-all duration-200 origin-top ${showServiceDropdown ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}>
                    <div className="p-2">
                      {services.map((service, index) => {
                        const Icon = service.icon;
                        const isSelected = selectedService === service.name;
                        return (
                          <button 
                            key={service.name} 
                            onClick={() => {
                              setSelectedService(service.name);
                              setShowServiceDropdown(false);
                            }} 
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted text-card-foreground"}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isSelected ? "bg-primary-foreground/20" : "bg-primary/10"}`}>
                              <Icon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                            </div>
                            <span className="flex-1 text-sm font-medium">{service.name}</span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Location Dropdown */}
                <div className="relative" ref={locationRef}>
                  <button 
                    onClick={() => {
                      setShowLocationDropdown(!showLocationDropdown);
                      setShowServiceDropdown(false);
                    }} 
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-secondary/80 text-left text-foreground hover:bg-secondary transition-all duration-200 group border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-200">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Location</span>
                      <p className={`text-sm font-semibold truncate ${selectedLocation ? "text-foreground" : "text-muted-foreground"}`}>
                        {selectedLocation || "Where in Lagos?"}
                      </p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showLocationDropdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {/* Location Dropdown Menu */}
                  <div className={`absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl border border-border z-50 overflow-hidden transition-all duration-200 origin-top ${showLocationDropdown ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}>
                    <div className="p-2">
                      {locations.map((location, index) => {
                        const isSelected = selectedLocation === location;
                        return (
                          <button 
                            key={location} 
                            onClick={() => {
                              setSelectedLocation(location);
                              setShowLocationDropdown(false);
                            }} 
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted text-card-foreground"}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isSelected ? "bg-accent-foreground/20" : "bg-accent/10"}`}>
                              <MapPin className={`h-4 w-4 ${isSelected ? "text-accent-foreground" : "text-accent"}`} />
                            </div>
                            <span className="flex-1 text-sm font-medium">{location}</span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <Button size="lg" className="w-full gap-2 h-12 shadow-lg hover:shadow-xl transition-all duration-200 mt-2" asChild>
                  <Link to="/services">
                    <Search className="h-5 w-5" />
                    <span className="font-semibold">Search Workers</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;