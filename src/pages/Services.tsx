import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WorkerCard from "@/components/workers/WorkerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, MapPin, Star, Building2, Navigation, Loader2 } from "lucide-react";
import heroServices from "@/assets/hero-services.jpg";
import { useParallax } from "@/hooks/useParallax";
import { useGeolocation, getDistanceToLocation, formatDistance } from "@/hooks/useGeolocation";
const allWorkers = [
  {
    id: "1",
    name: "Chioma Eze",
    role: "Professional Nanny",
    experience: "5 years exp",
    location: "Lekki",
    rating: 4.9,
    reviews: 47,
    hourlyRate: 2500,
    isVerified: true,
    isAgency: false,
    skills: ["Childcare", "First Aid", "Cooking", "English"],
    category: "nanny",
  },
  {
    id: "2",
    name: "Adebayo Ogundimu",
    role: "Personal Driver",
    experience: "8 years exp",
    location: "Victoria Island",
    rating: 4.8,
    reviews: 62,
    hourlyRate: 2000,
    isVerified: true,
    isAgency: true,
    skills: ["Lagos Routes", "Defensive Driving", "Vehicle Maintenance"],
    category: "driver",
  },
  {
    id: "3",
    name: "Blessing Okoro",
    role: "Housekeeper",
    experience: "4 years exp",
    location: "Ikoyi",
    rating: 4.9,
    reviews: 38,
    hourlyRate: 1800,
    isVerified: true,
    isAgency: false,
    skills: ["Cleaning", "Laundry", "Organization", "Cooking"],
    category: "housekeeper",
  },
  {
    id: "4",
    name: "Samuel Adeniyi",
    role: "Elderly Caregiver",
    experience: "6 years exp",
    location: "Ikeja",
    rating: 5.0,
    reviews: 29,
    hourlyRate: 3000,
    isVerified: true,
    isAgency: true,
    skills: ["Elderly Care", "Medical Assistance", "Companionship"],
    category: "caregiver",
  },
  {
    id: "5",
    name: "Grace Nwankwo",
    role: "Professional Cleaner",
    experience: "3 years exp",
    location: "Surulere",
    rating: 4.7,
    reviews: 23,
    hourlyRate: 1500,
    isVerified: true,
    isAgency: false,
    skills: ["Deep Cleaning", "Office Cleaning", "Laundry"],
    category: "cleaner",
  },
  {
    id: "6",
    name: "Funke Adeyemi",
    role: "Home Tutor",
    experience: "7 years exp",
    location: "Yaba",
    rating: 4.9,
    reviews: 51,
    hourlyRate: 3500,
    isVerified: true,
    isAgency: false,
    skills: ["Mathematics", "English", "Science", "Primary Education"],
    category: "tutor",
  },
  {
    id: "7",
    name: "Tunde Bakare",
    role: "Errand Runner",
    experience: "4 years exp",
    location: "Lekki",
    rating: 4.8,
    reviews: 35,
    hourlyRate: 1500,
    isVerified: true,
    isAgency: false,
    skills: ["Shopping", "Deliveries", "Bill Payments", "Bank Runs"],
    category: "errand",
  },
];

const categories = [
  { id: "all", label: "All Services" },
  { id: "nanny", label: "Nannies" },
  { id: "housekeeper", label: "Housekeepers" },
  { id: "cleaner", label: "Cleaners" },
  { id: "driver", label: "Drivers" },
  { id: "caregiver", label: "Caregivers" },
  { id: "tutor", label: "Tutors" },
  { id: "errand", label: "Errand Runners" },
];

const locations = ["All Areas", "Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Surulere", "Yaba", "Ajah"];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("All Areas");
  const [showFilters, setShowFilters] = useState(false);
  const [workerType, setWorkerType] = useState<"all" | "individual" | "agency">("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "reviews" | "price_low" | "price_high" | "nearest">("recommended");
  
  const { latitude, longitude, loading: geoLoading, error: geoError, requestLocation } = useGeolocation();

  const filteredWorkers = useMemo(() => {
    let workers = allWorkers.filter((worker) => {
      const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || worker.category === selectedCategory;
      const matchesLocation = selectedLocation === "All Areas" || worker.location === selectedLocation;
      const matchesType = workerType === "all" || 
        (workerType === "agency" && worker.isAgency) || 
        (workerType === "individual" && !worker.isAgency);
      const matchesRating = worker.rating >= minRating;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesType && matchesRating;
    });

    // Apply sorting
    switch (sortBy) {
      case "rating":
        workers = [...workers].sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        workers = [...workers].sort((a, b) => b.reviews - a.reviews);
        break;
      case "price_low":
        workers = [...workers].sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price_high":
        workers = [...workers].sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "nearest":
        if (latitude !== null && longitude !== null) {
          workers = [...workers].sort((a, b) => {
            const distA = getDistanceToLocation(latitude, longitude, a.location);
            const distB = getDistanceToLocation(latitude, longitude, b.location);
            return distA - distB;
          });
        }
        break;
      default:
        // recommended - keep default order
        break;
    }

    return workers;
  }, [searchQuery, selectedCategory, selectedLocation, workerType, minRating, sortBy, latitude, longitude]);

  // Get distance for display
  const getWorkerDistance = (location: string): string | null => {
    if (latitude === null || longitude === null) return null;
    const distance = getDistanceToLocation(latitude, longitude, location);
    return formatDistance(distance);
  };

  const handleSortByNearest = () => {
    if (latitude === null && longitude === null) {
      requestLocation();
    }
    setSortBy("nearest");
  };

  const [parallaxRef, parallaxStyle] = useParallax<HTMLDivElement>({ speed: 0.15 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Header with Background Image */}
        <div className="relative py-12 md:py-20 overflow-hidden">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0" ref={parallaxRef}>
            <img
              src={heroServices}
              alt="Verified domestic workers team"
              className="w-full h-full object-cover scale-110 transition-transform duration-100"
              style={parallaxStyle}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
          
          <div className="container relative">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Find Trusted Help
            </h1>
            <p className="text-white/80 mb-6 max-w-xl">
              Browse our network of verified domestic workers ready to help your family
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white border-0"
                />
              </div>
              <Button
                variant={showFilters ? "secondary" : "hero"}
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-white text-primary"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-secondary/50 border-b border-border">
            <div className="container py-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Worker Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Building2 className="h-4 w-4" />
                    Worker Type
                  </label>
                  <select
                    value={workerType}
                    onChange={(e) => setWorkerType(e.target.value as any)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">All Workers</option>
                    <option value="individual">Independent</option>
                    <option value="agency">Agency Workers</option>
                  </select>
                </div>

                {/* Min Rating */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Star className="h-4 w-4" />
                    Min Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLocation("All Areas");
                      setWorkerType("all");
                      setMinRating(0);
                      setSearchQuery("");
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredWorkers.length}</span> workers found
              {sortBy === "nearest" && latitude !== null && (
                <span className="ml-2 text-sm text-primary">• Sorted by distance</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={sortBy === "nearest" ? "default" : "outline"}
                size="sm"
                onClick={handleSortByNearest}
                disabled={geoLoading}
                className="gap-2"
              >
                {geoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                Sort by Nearest
              </Button>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="price_low">Lowest Price</option>
                <option value="price_high">Highest Price</option>
                {latitude !== null && <option value="nearest">Nearest First</option>}
              </select>
            </div>
          </div>

          {/* Geolocation status message */}
          {geoError && sortBy === "nearest" && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {geoError}
            </div>
          )}

          {filteredWorkers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkers.map((worker, index) => {
                const distance = getWorkerDistance(worker.location);
                return (
                  <div
                    key={worker.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <WorkerCard {...worker} distance={distance} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No workers found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
