import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "./MobileNav";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3 text-lg sm:text-xl font-bold">
          <Building2 className="h-8 w-auto" />
          <span className="hidden sm:inline">Imobiliária Adigital</span>
        </Link>
        
        {!loading && (
          isMobile ? (
            <MobileNav user={user} signOut={signOut} />
          ) : (
            <nav>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Olá, {user.email}
                    </span>
                    <Button onClick={signOut} variant="outline">
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost">
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button asChild>
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