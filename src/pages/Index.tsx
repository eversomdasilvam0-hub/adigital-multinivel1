import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/dashboard/ProfileCard";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="pt-8">
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo ao seu Painel
        </h1>
        <p className="text-muted-foreground">
          Aqui você poderá gerenciar sua rede e acompanhar suas comissões.
        </p>
      </header>
      <main className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <ProfileCard />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
            <div className="text-center p-10 border-2 border-dashed rounded-lg h-full flex items-center justify-center">
                <p className="text-muted-foreground">Em breve: gerenciamento da sua rede e comissões!</p>
            </div>
        </div>
      </main>
      <MadeWithLasy />
    </div>
  );
};

export default Index;