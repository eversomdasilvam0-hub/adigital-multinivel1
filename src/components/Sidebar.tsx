import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  TrendingUp,
  GraduationCap,
  Award,
  FileText,
  Shield,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      badge: null
    },
    {
      name: "Minha Rede",
      href: "/network",
      icon: Users,
      badge: "12"
    },
    {
      name: "Vendas",
      href: "/sales",
      icon: TrendingUp,
      badge: null
    },
    {
      name: "Treinamentos",
      href: "/training",
      icon: GraduationCap,
      badge: "Novo"
    },
    {
      name: "Recompensas",
      href: "/rewards",
      icon: Award,
      badge: null
    },
    {
      name: "Documentos",
      href: "/documents",
      icon: FileText,
      badge: null
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: User,
      badge: null
    },
    {
      name: "Admin",
      href: "/admin",
      icon: Shield,
      badge: null
    }
  ];

  if (isMobile) return null;

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50"></div>
      
      <div className="relative h-full flex flex-col p-4">
        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                {/* Active Background Animation */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 animate-pulse"></div>
                )}
                
                <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                
                {!collapsed && (
                  <>
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        className={`text-xs ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        {!collapsed && (
          <div className="mt-auto p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-white/20 dark:border-slate-700/50">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Rank Premium</h3>
              <p className="text-xs text-muted-foreground">Você está no topo!</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;