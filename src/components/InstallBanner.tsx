import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const VISIT_COUNT_KEY = "homecare_visit_count";
const BANNER_DISMISSED_KEY = "homecare_install_banner_dismissed";
const MIN_VISITS_TO_SHOW = 2;

const InstallBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if banner was dismissed
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Track visits
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
    localStorage.setItem(VISIT_COUNT_KEY, String(visitCount + 1));

    // Show banner for returning visitors
    if (visitCount + 1 >= MIN_VISITS_TO_SHOW) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
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
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Install prompt error:", error);
      } finally {
        setIsInstalling(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, String(Date.now()));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 shadow-2xl border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base truncate">
                  Install HomeCare Connect
                </p>
                <p className="text-white/70 text-xs sm:text-sm truncate">
                  Get faster access & offline support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {deferredPrompt ? (
                <Button
                  size="sm"
                  variant="hero"
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isInstalling ? "Installing..." : "Install"}
                  </span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="hero"
                  asChild
                  className="whitespace-nowrap"
                >
                  <Link to="/install">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">How to Install</span>
                  </Link>
                </Button>
              )}
              
              <button
                onClick={handleDismiss}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss install banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
