import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileCheck, 
  AlertCircle, 
  Users, 
  Lock, 
  Eye, 
  Phone,
  CheckCircle,
  BadgeCheck,
  CreditCard,
  MessageSquare,
  HeadphonesIcon,
  FileWarning,
  Scale
} from "lucide-react";

const verificationSteps = [
  {
    icon: FileCheck,
    title: "NIMC Identity Verification",
    description: "Every worker must provide their National Identification Number (NIN) which we verify through the National Identity Management Commission database.",
    details: [
      "Real-time NIN verification",
      "Photo matching with government records",
      "Address verification",
      "Date of birth confirmation"
    ]
  },
  {
    icon: Shield,
    title: "Police Clearance Certificate",
    description: "We require a valid Police Clearance Certificate from the Nigerian Police Force to ensure workers have no criminal record.",
    details: [
      "Criminal background check",
      "Validity period verification",
      "Direct verification with NPF",
      "Regular renewal requirements"
    ]
  },
  {
    icon: Users,
    title: "Agency Vetting",
    description: "Workers from partner agencies undergo additional vetting through their agency's internal processes.",
    details: [
      "Agency registration verification",
      "CAC registration check",
      "Agency reputation scoring",
      "Worker training verification"
    ]
  },
  {
    icon: BadgeCheck,
    title: "Skills Assessment",
    description: "Workers complete assessments relevant to their service categories to verify their competence.",
    details: [
      "Service-specific tests",
      "Practical skill evaluation",
      "Reference checks",
      "Experience verification"
    ]
  }
];

const safetyFeatures = [
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Your payments are held in escrow until the job is completed to your satisfaction. We never share your financial information with workers."
  },
  {
    icon: Eye,
    title: "Transparent Reviews",
    description: "All reviews come from verified clients who have actually used the service. We don't allow fake or purchased reviews."
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description: "Communicate safely within our platform. Your personal phone number and email remain private until you choose to share them."
  },
  {
    icon: Phone,
    title: "Emergency Support",
    description: "Our 24/7 emergency hotline is available for urgent safety concerns. We take immediate action on serious reports."
  },
  {
    icon: CreditCard,
    title: "Payment Protection",
    description: "If a booking doesn't go as planned, our dispute resolution team will help mediate and ensure fair outcomes."
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Our customer support team is trained to handle safety concerns with urgency and discretion."
  }
];

const faqs = [
  {
    question: "How do you verify worker identities?",
    answer: "We verify worker identities through the National Identity Management Commission (NIMC) database. Workers must provide their NIN, and we cross-reference their photo and personal details with government records. This ensures that every worker on our platform is who they claim to be."
  },
  {
    question: "What happens if I have a safety concern during a booking?",
    answer: "If you have an immediate safety concern, contact our 24/7 emergency hotline. For non-urgent concerns, you can report them through the app or contact our support team. We take all safety reports seriously and investigate promptly. Depending on the severity, we may suspend the worker pending investigation."
  },
  {
    question: "How does payment protection work?",
    answer: "When you book a worker, your payment is held securely in escrow. The worker only receives payment after you confirm the job was completed satisfactorily. If there's a dispute, our team will mediate and make a fair decision based on the evidence provided by both parties."
  },
  {
    question: "Can I see a worker's background check results?",
    answer: "While we don't share the detailed results of background checks for privacy reasons, we display verification badges on worker profiles. A 'Police Cleared' badge indicates the worker has passed our criminal background check through the Nigerian Police Force."
  },
  {
    question: "What if a worker cancels or doesn't show up?",
    answer: "If a worker cancels or fails to show up, you'll receive a full refund. We also track worker reliability and may remove workers with repeated no-shows from the platform. You can check a worker's reliability rating before booking."
  },
  {
    question: "How do you handle disputes between clients and workers?",
    answer: "Our dispute resolution process involves reviewing all available evidence including booking details, messages, and any photos or documentation provided. We aim to resolve disputes fairly within 48 hours. Both parties can appeal decisions if they disagree with the outcome."
  },
  {
    question: "Are the reviews on worker profiles genuine?",
    answer: "Yes, all reviews come from verified clients who have completed a booking with that worker. We use multiple fraud detection methods to identify and remove fake reviews. Workers cannot pay for or incentivize positive reviews."
  },
  {
    question: "What training do workers receive?",
    answer: "While specific training varies by service category and agency, we encourage all workers to complete our platform orientation which covers professional conduct, client communication, and safety protocols. Agency workers often have additional training from their agencies."
  }
];

const TrustSafety = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold">Your Safety Matters</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Trust & Safety at HomeCare Nigeria
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We understand the importance of inviting someone into your home. That's why we've built 
                comprehensive verification and safety systems to give you peace of mind with every booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/services">Find Verified Workers</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/for-workers">Become a Worker</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                Verification Process
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                How We Verify Every Worker
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Before a worker can accept bookings on our platform, they must complete our rigorous 
                multi-step verification process.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {verificationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.title} className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            Step {index + 1}
                          </span>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                Safety Features
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Built-In Protections for You
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform includes multiple layers of protection to ensure safe and secure experiences.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {safetyFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="text-center h-full">
                    <CardContent className="pt-6">
                      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Clients and Workers Tabs */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <Tabs defaultValue="clients" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="clients">For Clients</TabsTrigger>
                <TabsTrigger value="workers">For Workers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clients">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Client Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Check verification badges</h4>
                          <p className="text-sm text-muted-foreground">
                            Always look for NIMC and Police Clearance badges on worker profiles before booking.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Read reviews carefully</h4>
                          <p className="text-sm text-muted-foreground">
                            Review feedback from other clients to understand the worker's reliability and quality.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Use in-app messaging</h4>
                          <p className="text-sm text-muted-foreground">
                            Keep communication within the app until you're comfortable sharing personal details.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Pay through the platform</h4>
                          <p className="text-sm text-muted-foreground">
                            Always use our secure payment system for protection. Avoid cash payments outside the platform.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Report concerns immediately</h4>
                          <p className="text-sm text-muted-foreground">
                            If something doesn't feel right, contact our support team or use the emergency hotline.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workers">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Worker Safety Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Verify booking details</h4>
                          <p className="text-sm text-muted-foreground">
                            Always confirm the booking address and client details before arriving at the location.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Share your location</h4>
                          <p className="text-sm text-muted-foreground">
                            Let a trusted friend or family member know where you'll be working.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Use in-app communication</h4>
                          <p className="text-sm text-muted-foreground">
                            Keep conversations within the platform to maintain records and protect your privacy.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Trust your instincts</h4>
                          <p className="text-sm text-muted-foreground">
                            If a situation feels unsafe, you have the right to leave. Contact support immediately.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Document your work</h4>
                          <p className="text-sm text-muted-foreground">
                            Take photos before and after (where appropriate) to protect against false claims.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                FAQ
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Emergency Contact CTA */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Need Urgent Help?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                If you have an immediate safety concern, our emergency support team is available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="hero" asChild>
                  <a href="tel:+2348001234567">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Emergency Line
                  </a>
                </Button>
                <Button size="lg" variant="hero-outline" asChild>
                  <Link to="/dashboard/messages">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TrustSafety;
