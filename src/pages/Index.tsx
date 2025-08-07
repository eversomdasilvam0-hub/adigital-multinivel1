import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MadeWithLasy } from "@/components/made-with-lasy";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileCard from "@/components/dashboard/ProfileCard";
import MyNetworkCard from "@/components/dashboard/MyNetworkCard";
import InviteCard from "@/components/dashboard/InviteCard";

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
        <div className="pt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full lg:col-span-1" />
            <Skeleton className="h-96 w-full md:col-span-2 lg:col-span-2" />
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
          Gerencie sua rede e acompanhe seus resultados.
        </p>
      </header>
      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-8">
            <ProfileCard />
            <InviteCard />
        </div>
        <div className="md:col-span-2">
            <MyNetworkCard />
        </div>
      </main>
      <MadeWithLasy />
    </div>
  );
};

export default Index;