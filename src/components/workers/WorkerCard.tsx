import { Star, Shield, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface WorkerCardProps {
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
  distance?: string | null;
}

const WorkerCard = ({
  id,
  name,
  photo,
  role,
  experience,
  location,
  rating,
  reviews,
  hourlyRate,
  isVerified,
  isAgency,
  skills,
  distance,
}: WorkerCardProps) => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group">
      {/* Header with Photo */}
      <div className="relative p-4 pb-0">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/20">
              {name.split(" ").map((n) => n[0]).join("")}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isVerified && (
              <span className="trust-badge">
                <Shield className="h-3 w-3" />
                Verified
              </span>
            )}
            {isAgency && (
              <span className="premium-badge">
                Agency
              </span>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-bold text-primary">₦{hourlyRate.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/hr</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
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
          {distance && (
            <>
              <span className="mx-1">•</span>
              <span className="text-primary font-medium">{distance}</span>
            </>
          )}
          <span className="mx-1">•</span>
          <span>{experience}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-xs text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/workers/${id}`}>View Profile</Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/book/${id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
