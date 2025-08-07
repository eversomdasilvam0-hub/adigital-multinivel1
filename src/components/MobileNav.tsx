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
import { Menu, LogOut, LogIn, UserPlus, Sparkles } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface MobileNavProps {
  user: User | null;
  signOut: () => void;
}

const MobileNav = ({ user, signOut }: MobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-white/50 hover:bg-white/80 border-slate-200/50 hover:border-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-white/20 dark:border-slate-800/50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Menu
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3 py-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.email}
                </span>
              </div>
              <SheetClose asChild>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="justify-start gap-3 h-12 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  Sair
                </Button>
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button 
                  asChild 
                  variant="ghost" 
                  className="justify-start gap-3 h-12 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 transition-all duration-300 group"
                >
                  <Link to="/login" className="flex items-center gap-3 w-full">
                    <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    Entrar
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  asChild 
                  className="justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link to="/register" className="flex items-center gap-3 w-full">
                    <UserPlus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
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