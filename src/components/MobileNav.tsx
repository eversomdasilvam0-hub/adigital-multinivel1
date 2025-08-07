import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, LogOut, LogIn, UserPlus } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface MobileNavProps {
  user: User | null;
  signOut: () => void;
}

const MobileNav = ({ user, signOut }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-4">
          {user ? (
            <>
              <div className="text-sm text-muted-foreground p-2 border-b mb-2">
                {user.email}
              </div>
              <SheetClose asChild>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild variant="ghost" className="justify-start">
                  <Link to="/login" className="flex items-center gap-2 w-full">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild variant="ghost" className="justify-start">
                  <Link to="/register" className="flex items-center gap-2 w-full">
                    <UserPlus className="h-4 w-4" />
                    Cadastrar
                  </Link>
                </Button>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;