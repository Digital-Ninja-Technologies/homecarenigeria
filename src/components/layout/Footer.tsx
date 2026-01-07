import { Link } from "react-router-dom";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">HomeCare</span>
                <span className="text-[10px] font-medium opacity-70 leading-tight -mt-0.5">Connect Nigeria</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Nigeria's trusted platform connecting families with verified domestic workers. Safety first, always.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <MapPin className="h-4 w-4" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/services/nanny" className="hover:text-white transition-colors">Nannies</Link></li>
              <li><Link to="/services/housekeeper" className="hover:text-white transition-colors">Housekeepers</Link></li>
              <li><Link to="/services/cleaner" className="hover:text-white transition-colors">Cleaners</Link></li>
              <li><Link to="/services/driver" className="hover:text-white transition-colors">Drivers</Link></li>
              <li><Link to="/services/caregiver" className="hover:text-white transition-colors">Elderly Caregivers</Link></li>
              <li><Link to="/services/tutor" className="hover:text-white transition-colors">Home Tutors</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/trust-safety" className="hover:text-white transition-colors">Trust & Safety</Link></li>
              <li><Link to="/for-workers" className="hover:text-white transition-colors">Become a Worker</Link></li>
              <li><Link to="/for-agencies" className="hover:text-white transition-colors">For Agencies</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <a href="tel:+2348012345678" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>+234 801 234 5678</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@homecareconnect.ng" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>hello@homecareconnect.ng</span>
                </a>
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-xs text-primary-foreground/50">
                Emergency Line (24/7)
              </p>
              <a href="tel:+2348099999999" className="text-sm font-semibold text-accent hover:underline">
                +234 809 999 9999
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2024 HomeCare Connect Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
