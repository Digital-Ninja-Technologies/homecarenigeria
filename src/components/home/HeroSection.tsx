import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Shield, Star, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroFamily from "@/assets/hero-family.jpg";
import { useParallax } from "@/hooks/useParallax";

const services = ["Nanny", "Housekeeper", "Cleaner", "Driver", "Caregiver", "Home Tutor"];
const locations = ["Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Surulere", "Yaba", "Ajah"];

const HeroSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>({ speed: 0.15 });
  
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
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
        <div className="max-w-3xl mx-auto text-center text-white">
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

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: "0.2s"
        }}>
            Connect with verified nannies, housekeepers, drivers, and caregivers in Lagos. 
            Background-checked, reviewed, and ready to help.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl max-w-2xl mx-auto animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Service Dropdown */}
              <div className="relative flex-1">
                <button onClick={() => {
                setShowServiceDropdown(!showServiceDropdown);
                setShowLocationDropdown(false);
              }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary text-left text-foreground hover:bg-secondary/80 transition-colors">
                  <span className={selectedService ? "text-foreground" : "text-muted-foreground"}>
                    {selectedService || "What do you need?"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {showServiceDropdown && <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-lg border border-border z-50">
                    {services.map(service => <button key={service} onClick={() => {
                  setSelectedService(service);
                  setShowServiceDropdown(false);
                }} className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-foreground">
                        {service}
                      </button>)}
                  </div>}
              </div>

              {/* Location Dropdown */}
              <div className="relative flex-1">
                <button onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowServiceDropdown(false);
              }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary text-left text-foreground hover:bg-secondary/80 transition-colors">
                  <span className={selectedLocation ? "text-foreground" : "text-muted-foreground"}>
                    {selectedLocation || "Location in Lagos"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {showLocationDropdown && <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-lg border border-border z-50">
                    {locations.map(location => <button key={location} onClick={() => {
                  setSelectedLocation(location);
                  setShowLocationDropdown(false);
                }} className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl text-foreground">
                        {location}
                      </button>)}
                  </div>}
              </div>

              {/* Search Button */}
              <Button size="lg" className="gap-2 md:px-8" asChild>
                <Link to="/services">
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto animate-fade-in" style={{
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
      </div>
    </section>
  );
};
export default HeroSection;