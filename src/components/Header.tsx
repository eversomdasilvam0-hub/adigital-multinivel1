import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileNav from "./MobileNav";
import { Link } from "react-router-dom";
import { Building2, Bell } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Memorial Imóveis
            </h1>
            <p className="text-xs text-muted-foreground">Sistema Multinível</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && user && (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Corretor Ativo</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <Button onClick={signOut} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        )}

        {/* Desktop Auth Buttons */}
        {!isMobile && !user && (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && <MobileNav user={user} signOut={signOut} />}
      </div>
    </header>
  );
};

export default Header;