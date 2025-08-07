import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  TrendingUp,
  GraduationCap,
  Award,
  FileText,
  Settings,
  Shield
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Minha Rede", path: "/network" },
    { icon: TrendingUp, label: "Vendas", path: "/sales" },
    { icon: GraduationCap, label: "Treinamentos", path: "/training" },
    { icon: Award, label: "Recompensas", path: "/rewards" },
    { icon: FileText, label: "Documentos", path: "/documents" },
    { icon: Settings, label: "Perfil", path: "/profile" },
  ];

  // Adicionar item admin se for admin
  if (user?.email === "everson@memorialconstrutora.com.br") {
    menuItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl z-40">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/50 text-gray-700 dark:text-gray-300"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600",
                "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;