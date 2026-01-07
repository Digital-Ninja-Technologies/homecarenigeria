import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Phone, 
  MapPin, 
  Mail,
  Upload,
  CheckCircle2,
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const locations = [
  "Lekki", "Ajah", "Victoria Island", "Ikoyi", "Ikeja", 
  "Surulere", "Yaba", "Gbagada", "Maryland", "Magodo", "Lagos Island"
];

const SignupAgency = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    location: "",
    website: "",
    description: "",
    workerCount: "",
    yearsInBusiness: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
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
                  s < step ? 'bg-primary text-primary-foreground' : 
                  s === step ? 'bg-primary text-primary-foreground' : 
                  'bg-secondary text-muted-foreground'
                }`}>
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 mx-2 ${s < step ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Agency Info */}
            {step === 1 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Register your agency</h1>
                  <p className="text-muted-foreground">Partner with Lagos's leading domestic staffing platform</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="agencyName" 
                      placeholder="Premium Home Services Ltd"
                      className="pl-10"
                      value={formData.agencyName}
                      onChange={(e) => updateFormData("agencyName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input 
                    id="contactName" 
                    placeholder="Full name"
                    value={formData.contactName}
                    onChange={(e) => updateFormData("contactName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="info@agency.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
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
              </>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Business details</h1>
                  <p className="text-muted-foreground">Tell us more about your agency</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      id="address" 
                      placeholder="Full office address"
                      className="pl-10 min-h-[80px]"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Primary Service Area</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input 
                    id="website" 
                    type="url"
                    placeholder="https://www.youragency.com"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workerCount">Number of Workers</Label>
                    <Select value={formData.workerCount} onValueChange={(value) => updateFormData("workerCount", value)}>
                      <SelectTrigger>
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-25">11-25</SelectItem>
                        <SelectItem value="26-50">26-50</SelectItem>
                        <SelectItem value="51-100">51-100</SelectItem>
                        <SelectItem value="100+">100+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                    <Select value={formData.yearsInBusiness} onValueChange={(value) => updateFormData("yearsInBusiness", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Agency Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Tell clients about your agency, services, and what makes you different..."
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Business documents</h1>
                  <p className="text-muted-foreground">Upload documents to verify your agency</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "CAC Certificate", required: true },
                    { label: "Business License", required: true },
                    { label: "Tax Clearance Certificate", required: false },
                    { label: "Company Profile / Portfolio", required: false },
                  ].map((doc, index) => (
                    <div key={index} className="border border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {doc.label}
                            {doc.required && <span className="text-destructive ml-1">*</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 10MB</p>
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
                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
                    <Link to="/agency-terms" className="text-primary hover:underline">Agency Partnership Agreement</Link>
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
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === 3 ? "Submit Application" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
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
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary via-primary to-primary/90 p-12">
        <div className="max-w-md mx-auto text-primary-foreground">
          <h2 className="text-3xl font-bold mb-6">Grow Your Agency</h2>
          <div className="space-y-6">
            {[
              { title: "Expand Your Reach", desc: "Connect with thousands of clients across Lagos" },
              { title: "Manage Your Team", desc: "Centralized dashboard for all your workers" },
              { title: "Track Performance", desc: "Detailed analytics and insights" },
              { title: "Priority Support", desc: "Dedicated account manager for your agency" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-primary-foreground/10 rounded-xl">
            <p className="text-sm text-primary-foreground/80">
              "HomeCare Connect helped us grow from 15 to 50 workers in just 6 months. The platform is a game-changer."
            </p>
            <p className="text-sm font-semibold mt-2">— Premium Staffing Agency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupAgency;
