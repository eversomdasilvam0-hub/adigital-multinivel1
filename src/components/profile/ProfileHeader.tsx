import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Edit3,
  X,
  Camera,
  Shield,
  Star,
  Award,
  Calendar
} from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    full_name: string;
    role: string;
    status: string;
    created_at: string;
  };
  userEmail: string;
  rank: number;
  editing: boolean;
  onEditToggle: () => void;
  onSignOut: () => void;
}

const ProfileHeader = ({ 
  profile, 
  userEmail, 
  rank, 
  editing, 
  onEditToggle, 
  onSignOut 
}: ProfileHeaderProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'gerente': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inativo': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-0 shadow-xl">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {profile.full_name?.charAt(0) || userEmail?.charAt(0) || 'U'}
              </div>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl"
                variant="outline"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {profile.full_name || 'Nome não informado'}
                </h1>
                <p className="text-muted-foreground text-lg">{userEmail}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className={getRoleColor(profile.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
                </Badge>
                <Badge className={getStatusColor(profile.status)}>
                  <Star className="h-3 w-3 mr-1" />
                  {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1)}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <Award className="h-3 w-3 mr-1" />
                  Rank #{rank}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={onEditToggle}
                variant="outline"
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl"
              >
                {editing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {editing ? 'Cancelar' : 'Editar'}
              </Button>
              <Button
                onClick={onSignOut}
                variant="outline"
                className="bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 hover:bg-red-100"
              >
                Sair
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProfileHeader;