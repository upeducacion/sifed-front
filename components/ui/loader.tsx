import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullHeight?: boolean;
}

export default function Loader({ 
  text = "Cargando...", 
  size = "md", 
  className,
  fullHeight = true
}: LoaderProps) {
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-brand-500",
      fullHeight && "min-h-[200px] w-full py-12",
      className
    )}>
      <Loader2 className={cn("animate-spin mb-3", sizeClasses[size])} />
      {text && (
        <p className={cn("font-medium text-muted-foreground", textClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}
