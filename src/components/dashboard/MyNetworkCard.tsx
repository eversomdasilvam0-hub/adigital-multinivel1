import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "../../lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface ReferredUser {
  id: string;
  full_name: string;
}

const MyNetworkCard = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("referrer_id", user.id);

        if (error) {
          console.error("Erro ao buscar a rede:", error.message);
        } else if (data) {
          setNetwork(data);
        }
      } catch (err: any) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minha Rede</CardTitle>
        <CardDescription>Corretores que você indicou ({network.length}).</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : network.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            <Users className="mx-auto h-8 w-8 mb-2" />
            <p>Você ainda não indicou nenhum corretor.</p>
            <p>Use o link de convite para começar a montar sua rede!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {network.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.full_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{member.full_name}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyNetworkCard;