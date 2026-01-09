import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Briefcase,
  Upload,
  CheckCircle2,
  Lock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ServiceCategory = Database["public"]["Enums"]["service_category"];

const locations = [
  "Lekki", "Ajah", "Victoria Island", "Ikoyi", "Ikeja", 
  "Surulere", "Yaba", "Gbagada", "Maryland", "Magodo"
];

const serviceTypes: { id: ServiceCategory; label: string }[] = [
  { id: "nanny", label: "Nanny / Childcare" },
  { id: "housekeeper", label: "Housekeeper" },
  { id: "cleaner", label: "Cleaner" },
  { id: "driver", label: "Driver" },
  { id: "caregiver", label: "Elderly Caregiver" },
  { id: "tutor", label: "Home Tutor" },
];

const SignupWorker = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    services: [] as ServiceCategory[],
    experience: "",
    bio: "",
    hourlyRate: "",
    availability: "",
  });

  const updateFormData = (field: string, value: string | ServiceCategory[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: ServiceCategory) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      if (step === 1) {
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
      }
      setStep(step + 1);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          },
        },
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            email: formData.email.trim(),
            phone: formData.phone ? formData.phone.trim() : null,
            location: formData.location || null,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'worker',
          });

        if (roleError) {
          console.error('Role creation error:', roleError);
        }

        // Create worker profile
        const experienceMap: Record<string, number> = {
          "0-1": 0,
          "1-3": 2,
          "3-5": 4,
          "5+": 6,
        };

        const { error: workerError } = await supabase
          .from('workers')
          .insert({
            user_id: authData.user.id,
            services: formData.services.length > 0 ? formData.services : ['cleaner'],
            bio: formData.bio || null,
            hourly_rate: formData.hourlyRate ? parseInt(formData.hourlyRate) : null,
            experience_years: experienceMap[formData.experience] || 0,
            working_areas: formData.location ? [formData.location] : [],
          });

        if (workerError) {
          console.error('Worker creation error:', workerError);
        }

        // Create wallet for the worker
        const { error: walletError } = await supabase
          .from('wallets')
          .insert({
            user_id: authData.user.id,
          });

        if (walletError) {
          console.error('Wallet creation error:', walletError);
        }

        toast.success("Account created successfully!");
        navigate('/worker/dashboard');
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary leading-tight">HomeCare</span>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight -mt-0.5">Connect Nigeria</span>
            </div>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  s < step ? 'bg-accent text-white' : 
                  s === step ? 'bg-accent text-white' : 
                  'bg-secondary text-muted-foreground'
                }`}>
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 mx-2 ${s < step ? 'bg-accent' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Create your profile</h1>
                  <p className="text-muted-foreground">Start earning by helping families in Lagos</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="firstName" 
                        placeholder="Chidi"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Okoro"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="chidi@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      placeholder="+234 801 234 5678"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Primary Work Location</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Services & Experience */}
            {step === 2 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Your services</h1>
                  <p className="text-muted-foreground">Tell us what you can help with</p>
                </div>

                <div className="space-y-2">
                  <Label>Services You Offer</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.services.includes(service.id)
                            ? 'border-accent bg-accent/5'
                            : 'border-border hover:border-accent/50'
                        }`}
                        onClick={() => toggleService(service.id)}
                      >
                        <Checkbox 
                          checked={formData.services.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <span className="text-sm font-medium">{service.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                    <SelectTrigger>
                      <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell clients about your experience, skills, and what makes you great at your job..."
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={(e) => updateFormData("bio", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number"
                      placeholder="2000"
                      value={formData.hourlyRate}
                      onChange={(e) => updateFormData("hourlyRate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={formData.availability} onValueChange={(value) => updateFormData("availability", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="weekends">Weekends only</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Verification documents</h1>
                  <p className="text-muted-foreground">Upload documents to get verified faster</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "NIMC ID / NIN Slip", required: true },
                    { label: "Police Clearance Certificate", required: true },
                    { label: "Proof of Address", required: false },
                    { label: "Professional Certificates", required: false },
                  ].map((doc, index) => (
                    <div key={index} className="border border-dashed border-border rounded-lg p-4 hover:border-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {doc.label}
                            {doc.required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 5MB</p>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          Upload
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button type="submit" variant="accent" className="flex-1" disabled={isLoading}>
                {isLoading ? "Creating account..." : step === 3 ? "Complete Signup" : "Continue"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-accent via-accent to-accent/90 p-12">
        <div className="max-w-md mx-auto text-white">
          <h2 className="text-3xl font-bold mb-6">Start Earning Today</h2>
          <div className="space-y-6">
            {[
              { title: "Set Your Own Rates", desc: "Earn ₦2,000 - ₦5,000+ per hour" },
              { title: "Flexible Schedule", desc: "Work when and where you want" },
              { title: "Secure Payments", desc: "Get paid on time, every time" },
              { title: "Build Your Reputation", desc: "Grow through ratings & reviews" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupWorker;