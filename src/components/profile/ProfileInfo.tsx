import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  Save
} from "lucide-react";

interface ProfileInfoProps {
  profile: {
    full_name: string;
    phone: string;
    cpf: string;
  };
  userEmail: string;
  editing: boolean;
  editForm: {
    full_name: string;
    phone: string;
    cpf: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
}

const ProfileInfo = ({ 
  profile, 
  userEmail, 
  editing, 
  editForm, 
  onFormChange, 
  onSave 
}: ProfileInfoProps) => {
  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => onFormChange('full_name', e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={editForm.cpf}
                onChange={(e) => onFormChange('cpf', e.target.value)}
                className="h-12"
                disabled
              />
              <p className="text-xs text-muted-foreground">CPF não pode ser alterado</p>
            </div>
            <Button
              onClick={onSave}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <InfoField
              icon={User}
              label="Nome Completo"
              value={profile.full_name || 'Não informado'}
            />
            <InfoField
              icon={Mail}
              label="Email"
              value={userEmail}
            />
            <InfoField
              icon={Phone}
              label="Telefone"
              value={profile.phone || 'Não informado'}
            />
            <InfoField
              icon={Shield}
              label="CPF"
              value={profile.cpf || 'Não informado'}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface InfoFieldProps {
  icon: any;
  label: string;
  value: string;
}

const InfoField = ({ icon: Icon, label, value }: InfoFieldProps) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <Icon className="h-5 w-5 text-gray-500" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default ProfileInfo;