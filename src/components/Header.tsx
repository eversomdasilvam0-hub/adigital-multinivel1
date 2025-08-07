import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold">
          <img src="/logo.png" alt="Imobiliária Adigital Logo" className="h-8 w-auto" />
          <span>Imobiliária Adigital</span>
        </Link>
        <nav>
          {!loading && (
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
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
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;