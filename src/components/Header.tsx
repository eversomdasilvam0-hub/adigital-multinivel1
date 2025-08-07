import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Building2, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/MobileNav";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link 
          to="/" 
          className="flex items-center gap-3 text-lg sm:text-xl font-bold group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <Building2 className="h-8 w-auto text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
            Imobiliária Adigital
          </span>
        </Link>
        
        {!loading && (
          isMobile ? (
            <MobileNav user={user} signOut={signOut} />
          ) : (
            <nav>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {user.email}
                      </span>
                    </div>
                    <Button 
                      onClick={signOut} 
                      variant="outline"
                      className="bg-white/50 hover:bg-white/80 border-slate-200/50 hover:border-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      variant="ghost"
                      className="hover:bg-white/50 hover:backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button 
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Link to="/register">Cadastrar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          )
        )}
      </div>
    </header>
  );
};

export default Header;