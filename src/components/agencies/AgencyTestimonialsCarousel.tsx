import { useRef, useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import agencyLogoElite from "@/assets/agency-logo-elite.jpg";
import agencyLogoLagos from "@/assets/agency-logo-lagos.jpg";
import agencyLogoPremier from "@/assets/agency-logo-premier.jpg";
import agencyLogoTrusthouse from "@/assets/agency-logo-trusthouse.jpg";

const testimonials = [
  {
    quote: "HomeCare Connect transformed how we manage our 50+ workers. The dashboard gives us real-time visibility into bookings and performance. Our revenue has grown 40% since joining.",
    author: "Chinedu Okonkwo",
    role: "Managing Director",
    agency: "Elite Staffing Solutions",
    logo: agencyLogoElite,
  },
  {
    quote: "The verification process is seamless and clients trust our workers more because of the platform's credibility. We've seen a 3x increase in client inquiries.",
    author: "Adaora Eze",
    role: "Operations Manager",
    agency: "Lagos Care Partners",
    logo: agencyLogoLagos,
  },
  {
    quote: "Consolidated payments and analytics have made running our agency so much easier. We can now focus on growing our team instead of administrative tasks.",
    author: "Babatunde Adeyemi",
    role: "Founder & CEO",
    agency: "Premier Home Services",
    logo: agencyLogoPremier,
  },
  {
    quote: "The dedicated support team understands the Lagos market. They helped us onboard 30 workers in just one week. Truly a game-changer for our business.",
    author: "Ngozi Okafor",
    role: "Business Development Lead",
    agency: "TrustHouse Agency",
    logo: agencyLogoTrusthouse,
  },
];

const AgencyTestimonialsCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [api, setApi] = useState<CarouselApi>();
  const [visibleSlides, setVisibleSlides] = useState<number[]>([0, 1]);

  useEffect(() => {
    if (!api) return;

    const updateVisibleSlides = () => {
      const slidesInView = api.slidesInView();
      setVisibleSlides(slidesInView);
    };

    updateVisibleSlides();
    api.on("slidesInView", updateVisibleSlides);
    api.on("select", updateVisibleSlides);

    return () => {
      api.off("slidesInView", updateVisibleSlides);
      api.off("select", updateVisibleSlides);
    };
  }, [api]);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leading Agencies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from agency partners who have transformed their business with HomeCare Connect.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          setApi={setApi}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2">
                <div 
                  className={`bg-card rounded-2xl p-6 md:p-8 border border-border h-full flex flex-col transition-all duration-500 ${
                    visibleSlides.includes(index) 
                      ? "opacity-100 translate-y-0 scale-100" 
                      : "opacity-0 translate-y-4 scale-95"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-background border border-border flex items-center justify-center p-2">
                      <img
                        src={testimonial.logo}
                        alt={`${testimonial.agency} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.agency}</h4>
                      <p className="text-sm text-muted-foreground">Partner Agency</p>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <Quote className="h-8 w-8 text-primary/20 absolute -top-1 -left-1" />
                    <p className="text-muted-foreground italic pl-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default AgencyTestimonialsCarousel;
