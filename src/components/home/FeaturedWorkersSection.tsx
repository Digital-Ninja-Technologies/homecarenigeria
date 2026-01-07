import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import WorkerCard from "@/components/workers/WorkerCard";

const featuredWorkers = [
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
  },
];

const FeaturedWorkersSection = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWorkers.map((worker, index) => (
            <div
              key={worker.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <WorkerCard {...worker} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkersSection;
