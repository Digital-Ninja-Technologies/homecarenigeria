import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Download, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Share, 
  PlusSquare,
  MoreVertical,
  ArrowRight
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error("Install prompt error:", error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const benefits = [
    "Instant access from your home screen",
    "Works offline for faster loading",
    "Receive push notifications",
    "Native app-like experience",
    "No app store download required",
    "Automatic updates"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                <Download className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Install HomeCare Connect
              </h1>
              
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Get the full app experience. Install HomeCare Connect on your device for faster access and offline capabilities.
              </p>

              {isInstalled ? (
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                  <span className="font-semibold">App Already Installed!</span>
                </div>
              ) : deferredPrompt ? (
                <Button
                  size="xl"
                  variant="hero"
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="group"
                >
                  {isInstalling ? (
                    "Installing..."
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Install Now
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-white/70 text-sm">
                  Follow the instructions below for your device
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Install the App?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enjoy a seamless experience with these benefits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Instructions */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How to Install
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your device type for step-by-step instructions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* iOS Instructions */}
              <Card className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Smartphone className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">iPhone & iPad</h3>
                      <p className="text-sm text-muted-foreground">Safari Browser</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Tap the <strong>Share</strong> button in Safari</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <Share className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Share icon</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Scroll and tap <strong>"Add to Home Screen"</strong></p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <PlusSquare className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Add to Home Screen</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Tap <strong>"Add"</strong> to confirm installation</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Android Instructions */}
              <Card className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Smartphone className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Android</h3>
                      <p className="text-sm text-muted-foreground">Chrome Browser</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Tap the <strong>Menu</strong> button (three dots)</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <MoreVertical className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Menu icon</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <Download className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Install app</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Tap <strong>"Install"</strong> to confirm</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Desktop Instructions */}
              <Card className="overflow-hidden border-2 hover:border-primary/30 transition-colors lg:col-span-2">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <Monitor className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Desktop</h3>
                      <p className="text-sm text-muted-foreground">Chrome, Edge, or other supported browsers</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Look for the <strong>install icon</strong> in the address bar</p>
                        <div className="mt-2 inline-flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                          <Download className="w-5 h-5 text-primary" />
                          <span className="text-sm text-muted-foreground">Install icon</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Click the icon or use the <strong>"Install"</strong> button above</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">Click <strong>"Install"</strong> in the popup to confirm</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
