import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface MobileNavProps {
  user: User | null;
  signOut: () => void;
}

const MobileNav = ({ user, signOut }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b shadow-lg z-50">
          <div className="container mx-auto p-4 space-y-4">
            {user ? (
              <>
                <div className="text-sm text-muted-foreground">
                  Olá, {user.email}
                </div>
                <Button onClick={signOut} variant="outline" className="w-full">
                  Sair
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;