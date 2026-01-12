import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Star, Shield, MapPin } from "lucide-react";
import WorkerCard from "@/components/workers/WorkerCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import workerChioma from "@/assets/worker-chioma.jpg";
import workerAdebayo from "@/assets/worker-adebayo.jpg";
import workerBlessing from "@/assets/worker-blessing.jpg";
import workerSamuel from "@/assets/worker-samuel.jpg";

// Fallback images for workers without photos
const fallbackImages = [workerChioma, workerAdebayo, workerBlessing, workerSamuel];

// Mock data for when no workers exist in database
const mockWorkers = [
  {
    id: "mock-1",
    name: "Chioma Eze",
    photo: workerChioma,
    role: "Professional Nanny",
    experience: "5 years exp",
    location: "Lekki",
    rating: 4.9,
    reviews: 47,
    hourlyRate: 2500,
    isVerified: true,
    isAgency: false,
    skills: ["Childcare", "First Aid", "Cooking", "English"],
  },
  {
    id: "mock-2",
    name: "Adebayo Ogundimu",
    photo: workerAdebayo,
    role: "Personal Driver",
    experience: "8 years exp",
    location: "Victoria Island",
    rating: 4.8,
    reviews: 62,
    hourlyRate: 2000,
    isVerified: true,
    isAgency: true,
    skills: ["Lagos Routes", "Defensive Driving", "Vehicle Maintenance"],
  },
  {
    id: "mock-3",
    name: "Blessing Okoro",
    photo: workerBlessing,
    role: "Housekeeper",
    experience: "4 years exp",
    location: "Ikoyi",
    rating: 4.9,
    reviews: 38,
    hourlyRate: 1800,
    isVerified: true,
    isAgency: false,
    skills: ["Cleaning", "Laundry", "Organization", "Cooking"],
  },
  {
    id: "mock-4",
    name: "Samuel Adeniyi",
    photo: workerSamuel,
    role: "Elderly Caregiver",
    experience: "6 years exp",
    location: "Ikeja",
    rating: 5.0,
    reviews: 29,
    hourlyRate: 3000,
    isVerified: true,
    isAgency: true,
    skills: ["Elderly Care", "Medical Assistance", "Companionship"],
  },
];

interface WorkerData {
  id: string;
  name: string;
  photo?: string;
  role: string;
  experience: string;
  location: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  isVerified: boolean;
  isAgency: boolean;
  skills: string[];
}

// Mock worker card that shows a toast instead of navigating
const MockWorkerCard = ({ name, photo, role, experience, location, rating, reviews, hourlyRate, isVerified, isAgency, skills }: WorkerData) => {
  const handleClick = () => {
    toast.info("This is a demo worker. Sign up to see real verified workers!");
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group">
      <div className="relative p-4 pb-0">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/20">
              {name.split(" ").map((n) => n[0]).join("")}
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isVerified && (
              <span className="trust-badge">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
            {isAgency && <span className="premium-badge">Agency</span>}
          </div>
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-bold text-primary">₦{hourlyRate.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-premium text-premium" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
          <span className="mx-1">•</span>
          <span>{experience}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-xs text-secondary-foreground">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">
              +{skills.length - 3} more
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleClick}>
            View Profile
          </Button>
          <Button size="sm" className="flex-1" onClick={handleClick}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const FeaturedWorkersSection = () => {
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedWorkers();
  }, []);

  const fetchFeaturedWorkers = async () => {
    try {
      // Fetch workers from public_workers view (includes profile data)
      const { data: workersData, error } = await supabase
        .from('public_workers')
        .select('id, services, hourly_rate, experience_years, rating, total_jobs, verification_status, agency_id, working_areas, full_name, avatar_url, location')
        .order('rating', { ascending: false })
        .limit(4);

      if (error) throw error;

      if (workersData && workersData.length > 0) {

        const formattedWorkers: WorkerData[] = workersData.map((worker, index) => {
          return {
            id: worker.id,
            name: worker.full_name || 'Worker',
            photo: worker.avatar_url || fallbackImages[index % fallbackImages.length],
            role: worker.services?.[0] ? `${worker.services[0].charAt(0).toUpperCase()}${worker.services[0].slice(1)}` : 'Domestic Worker',
            experience: `${worker.experience_years || 0} years exp`,
            location: worker.working_areas?.[0] || worker.location || 'Lagos',
            rating: worker.rating || 0,
            reviews: worker.total_jobs || 0,
            hourlyRate: worker.hourly_rate || 2000,
            isVerified: worker.verification_status === 'verified',
            isAgency: !!worker.agency_id,
            skills: worker.services || [],
          };
        });
        setWorkers(formattedWorkers);
      } else {
        // Use mock data if no workers in database
        setWorkers(mockWorkers);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      // Fallback to mock data on error
      setWorkers(mockWorkers);
    } finally {
      setLoading(false);
    }
  };

  // Check if using mock data (workers with IDs starting with "mock-")
  const isMockData = workers.length > 0 && workers[0].id.startsWith('mock-');

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
              Top Rated
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Featured Workers
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Hand-picked professionals with excellent reviews and verified backgrounds
            </p>
          </div>
          <Button variant="outline" className="gap-2 self-start md:self-auto" asChild>
            <Link to="/services">
              View All Workers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workers.map((worker, index) => (
              <div
                key={worker.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isMockData ? (
                  <MockWorkerCard {...worker} />
                ) : (
                  <WorkerCard {...worker} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWorkersSection;
