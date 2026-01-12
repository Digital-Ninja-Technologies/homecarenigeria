import { Star, Quote } from "lucide-react";
import testimonialAdaeze from "@/assets/testimonial-adaeze.jpg";
import testimonialEmeka from "@/assets/testimonial-emeka.jpg";
import testimonialFolake from "@/assets/testimonial-folake.jpg";

const testimonials = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    role: "Working Mother, Lekki",
    content: "Finding a reliable nanny used to be so stressful. HomeCare Connect made it easy - I found a wonderful, verified nanny within a week. The verification process gave me peace of mind.",
    rating: 5,
    image: testimonialAdaeze,
  },
  {
    id: 2,
    name: "Emeka Nwosu",
    role: "Business Owner, Victoria Island",
    content: "We needed a driver and housekeeper for our family. The platform's escrow system means I only pay when satisfied. The workers we found are professional and trustworthy.",
    rating: 5,
    image: testimonialEmeka,
  },
  {
    id: 3,
    name: "Folake Adeyemi",
    role: "Caregiver, Ikeja",
    content: "As a caregiver, this platform has transformed my career. I get consistent bookings, secure payments, and the verification badge helps families trust me immediately.",
    rating: 5,
    image: testimonialFolake,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what families and workers are saying about their experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-in relative"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-premium text-premium" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
