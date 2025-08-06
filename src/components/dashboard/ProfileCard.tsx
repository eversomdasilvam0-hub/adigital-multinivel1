import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Fingerprint, Phone } from "lucide-react";

interface Profile {
  full_name: string;
  cpf: string;
  phone: string;
}

const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, cpf, phone")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("Não foi possível buscar o perfil:", error.message);
        }

        if (data) {
          setProfile(data);
        }
      } catch (err: any) {
        console.error("Erro ao buscar perfil:", err);
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
           <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Suas informações de corretor.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile ? (
          <>
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{profile.full_name}</span>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <Fingerprint className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{profile.cpf}</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{profile.phone}</span>
            </div>
          </>
        ) : (
            <p className="text-sm text-muted-foreground">Não foi possível carregar os detalhes do perfil.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;