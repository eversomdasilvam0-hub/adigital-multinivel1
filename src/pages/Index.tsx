import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/dashboard/ProfileCard";
import MyNetworkCard from "@/components/dashboard/MyNetworkCard";
import InviteCard from "@/components/dashboard/InviteCard";
import CommissionsChart from "@/components/dashboard/CommissionsChart";

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Carregando Painel...</h1>
        <p className="text-muted-foreground">
          Aguarde enquanto verificamos sua sessão.
        </p>
        <div className="pt-8 grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1 flex flex-col gap-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Bem-vindo ao seu Painel
        </h1>
        <p className="text-muted-foreground">
          Gerencie sua rede e acompanhe seus resultados.
        </p>
      </header>
      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-8">
            <ProfileCard />
            <InviteCard />
        </div>
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
                <CommissionsChart />
            </div>
            <div className="lg:col-span-2">
                <MyNetworkCard />
            </div>
        </div>
      </main>
      <MadeWithLasy />
    </div>
  );
};

export default Index;