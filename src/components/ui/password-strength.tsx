import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

interface StrengthConfig {
  label: string;
  color: string;
  bgColor: string;
  segments: number;
}

const strengthConfigs: Record<StrengthLevel, StrengthConfig> = {
  weak: {
    label: "Weak",
    color: "bg-destructive",
    bgColor: "text-destructive",
    segments: 1,
  },
  medium: {
    label: "Medium",
    color: "bg-amber-500",
    bgColor: "text-amber-500",
    segments: 2,
  },
  strong: {
    label: "Strong",
    color: "bg-accent",
    bgColor: "text-accent",
    segments: 3,
  },
};

const calculateStrength = (password: string): StrengthLevel => {
  if (!password) return "weak";

  let score = 0;

  // Length checks
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Determine strength level
  if (score >= 6) return "strong";
  if (score >= 4) return "medium";
  return "weak";
};

const PasswordStrength = ({ password, className }: PasswordStrengthProps) => {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const config = strengthConfigs[strength];

  if (!password) return null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              segment <= config.segments ? config.color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium transition-colors", config.bgColor)}>
        {config.label} password
      </p>
    </div>
  );
};

export { PasswordStrength, calculateStrength };
