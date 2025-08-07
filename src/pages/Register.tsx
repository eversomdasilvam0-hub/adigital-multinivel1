import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    cpf: "",
    phone: "",
    referrerCode: ""
  });

  // Redirecionar se já estiver logado
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Verificar se o CPF já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('cpf', formData.cpf)
        .single();

      if (existingProfile) {
        toast.error("CPF já cadastrado no sistema");
        setLoading(false);
        return;
      }

      // Buscar referrer se código foi fornecido
      let referrerId = null;
      if (formData.referrerCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', formData.referrerCode)
          .single();
        
        if (referrer) {
          referrerId = referrer.id;
        } else {
          toast.error("Código de indicação inválido");
          setLoading(false);
          return;
        }
      }

      // Criar usuário
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            cpf: formData.cpf,
            phone: formData.phone,
            referrer_id: referrerId
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Enviar dados para o email administrativo
      await fetch('/api/send-registration-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          referrerCode: formData.referrerCode
        })
      }).catch(console.error); // Não bloquear o cadastro se o email falhar

      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      navigate("/login");

    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error("Erro interno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cadastro de Corretor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                type="text"
                required
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirme sua senha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrerCode">Código de Indicação (Opcional)</Label>
              <Input
                id="referrerCode"
                type="text"
                value={formData.referrerCode}
                onChange={(e) => setFormData({...formData, referrerCode: e.target.value})}
                placeholder="Código do seu indicador"
              />
            </div>

            <Alert>
              <AlertDescription>
                Seus dados serão enviados para análise e aprovação da equipe administrativa.
              </AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar
                </>
              )}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Fazer login
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;