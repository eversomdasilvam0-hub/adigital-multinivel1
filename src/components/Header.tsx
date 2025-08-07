import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/MobileNav";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link 
          to="/" 
          className="flex items-center gap-3 text-lg sm:text-xl font-bold hover:scale-105 transition-transform duration-200"
        >
          <Building2 className="h-8 w-auto text-blue-600 hover:text-blue-700 transition-colors" />
          <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full">
                      <span className="text-sm font-medium">
                        Olá, {user.email}
                      </span>
                    </div>
                    <Button 
                      onClick={signOut} 
                      variant="outline"
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="hover:bg-blue-50 transition-colors">
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button 
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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