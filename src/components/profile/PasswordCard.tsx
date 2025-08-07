import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordCardProps {
  passwordForm: {
    newPassword: string;
    confirmPassword: string;
  };
  onFormChange: (field: string, value: string) => void;
  onChangePassword: () => void;
}

const PasswordCard = ({ passwordForm, onFormChange, onChangePassword }: PasswordCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-600" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => onFormChange('newPassword', e.target.value)}
              className="h-12 pr-12"
              placeholder="Mínimo 6 caracteres"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={(e) => onFormChange('confirmPassword', e.target.value)}
            className="h-12"
            placeholder="Confirme a nova senha"
          />
        </div>
        <Button
          onClick={onChangePassword}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          disabled={!passwordForm.newPassword || !passwordForm.confirmPassword}
        >
          <Lock className="h-4 w-4 mr-2" />
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;