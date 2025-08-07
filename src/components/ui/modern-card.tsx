import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  gradient?: "blue" | "purple" | "green" | "orange" | "pink";
  hover?: boolean;
}

const gradientClasses = {
  blue: "from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50",
  purple: "from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50",
  green: "from-green-500/10 to-emerald-500/10 border-green-200/50 dark:border-green-800/50",
  orange: "from-orange-500/10 to-red-500/10 border-orange-200/50 dark:border-orange-800/50",
  pink: "from-pink-500/10 to-rose-500/10 border-pink-200/50 dark:border-pink-800/50",
};

export const ModernCard = ({ 
  children, 
  className, 
  gradient = "blue", 
  hover = true 
}: ModernCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl shadow-lg",
        "bg-white/70 dark:bg-slate-900/70",
        gradientClasses[gradient],
        hover && "transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1",
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
    </div>
  );
};