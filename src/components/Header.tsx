import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { 
  Building2, 
  Bell, 
  Search,
  Settings,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50"></div>
      
      <div className="relative container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Memorial Imóveis
            </h1>
            <p className="text-xs text-muted-foreground">Sistema Multinível</p>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        {user && !isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        {!isMobile && user && (
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative group">
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs animate-pulse">
                3
              </Badge>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="group">
              <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
            
            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
              >
                <div className="text-right">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Corretor Ativo</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </Button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setShowUserMenu(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Auth Buttons */}
        {!isMobile && !user && (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hover:bg-white/50 dark:hover:bg-slate-800/50">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="hover:bg-white/50 dark:hover:bg-slate-800/50"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 p-4">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Corretor Ativo</p>
                </div>
              </div>
              <Button onClick={signOut} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button asChild variant="ghost" className="w-full">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;