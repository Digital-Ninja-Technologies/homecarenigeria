import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, Phone, User, MapPin, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import authBackground from "@/assets/auth-background.jpg";

const locations = ["Lekki", "Victoria Island", "Ikoyi", "Ikeja", "Surulere", "Yaba", "Ajah"];

const SignupClient = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    address: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 2) {
      // Validate passwords match before proceeding
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
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
            full_name: formData.fullName.trim(),
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
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone ? `+234${formData.phone.replace(/\s/g, '')}` : null,
            location: formData.location || null,
          });

        if (profileError) {
          // Profile creation failed - continue but user may need to update profile later
        }

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'client',
          });

        if (roleError) {
          // Role creation failed - user may need to contact support
        }

        // Create wallet for the user
        const { error: walletError } = await supabase
          .from('wallets')
          .insert({
            user_id: authData.user.id,
          });

        if (walletError) {
          // Wallet creation failed - will be created on first transaction
        }

        toast.success("Account created successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
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
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s < step
                      ? "bg-accent text-accent-foreground"
                      : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 2 && (
                  <div className={`w-16 h-1 rounded ${s < step ? "bg-accent" : "bg-secondary"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {step === 1 ? "Create your account" : "Complete your profile"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {step === 1
              ? "Join as a client to find trusted domestic help"
              : "Tell us where you need help"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      +234
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="801 234 5678"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="pl-14"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="location">Location in Lagos</Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Select your area</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full address (optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="address"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 pl-10 text-sm resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button type="submit" size="lg" className="flex-1 gap-2" disabled={isLoading}>
                {isLoading ? "Creating account..." : step < 2 ? "Continue" : "Create Account"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Want to offer services?{" "}
            <Link to="/signup/worker" className="text-primary font-medium hover:underline">
              Join as a worker
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Image */}
        <img
          src={authBackground}
          alt="Trusted domestic worker"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="relative text-white text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Find help you can trust
          </h2>
          <p className="text-white/80 mb-8">
            All our workers are verified with NIMC and police background checks
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Background Verified</p>
                <p className="text-sm text-white/70">Every worker is checked</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Secure Payments</p>
                <p className="text-sm text-white/70">Pay only when satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupClient;