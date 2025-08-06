`: Create the Supabase client. This is a standard file.
3.  `<lasy-write path="src/pages/Login.tsx">`: Create the login page component. It will have email/password fields and a submit button. It will call `supabase.auth.signInWithPassword`.
4.  `<lasy-write path="src/pages/Register.tsx">`: Create the registration page. It will have fields for full name, CPF, phone, email, and password. It will call `supabase.auth.signUp` and pass the extra data.
5.  `<lasy-write path="src/App.tsx">`: Add routes for `/login` and `/register`.
6.  `<lasy-write path="src/pages/Index.tsx">`: I'll update the Index page to be a simple landing page with links to Login and Register.

This seems like a solid plan. I'll use shadcn components (`Card`, `Input`, `Button`, `Label`) to build the UI quickly. I'll also use `react-hook-form` and `zod` for form validation, as they are already in `package.json`.

Let's start with the SQL.
The trigger `handle_new_user` is good, but I also need to handle the `referrer_id`. The referral code would be passed during registration. The frontend would need to find the `referrer_id` from a referral code. This adds complexity. For the first step, I'll omit the referral logic and just create the user. I can add the referral system later. The user mentioned "Gerenciamento de rede até a terceira geração", so it's important, but I can build upon the initial structure.

Let's simplify the trigger and table for now. I'll remove `referrer_id` for this step.

Revised SQL:
```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  cpf text unique,
  phone text,
  created_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

-- Policy: Profiles are viewable by everyone.
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Policy: Users can insert their own profile.
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

-- Policy: Users can update their own profile.
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up.
-- It copies the full_name, cpf, and phone from the user's metadata.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, cpf, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'cpf', new.raw_user_meta_data->>'phone');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
This looks good. The trigger will handle profile creation automatically when a user signs up via `supabase.auth.signUp`. The frontend just needs to pass the extra data.

Now for the frontend files.

`src/lib/supabase.ts`: Standard Supabase client setup.
`src/pages/Login.tsx`: Form with email, password. On submit, call `supabase.auth.signInWithPassword`. After login, it should redirect. I'll use `useNavigate` from `react-router-dom`. I'll redirect to `/dashboard`, which I'll create later. For now, I'll just redirect to `/`.
`src/pages/Register.tsx`: Form with full name, CPF, phone, email, password. On submit, call `supabase.auth.signUp` with the extra data in the `options.data` field. After successful registration, I'll show a toast message asking the user to check their email for confirmation.
`src/App.tsx`: Add routes for `/login` and `/register`.
`src/pages/Index.tsx`: Update to be a landing page. I'll add a title, a brief description, and buttons to navigate to Login and Register.

I will also need to create a `Dashboard.tsx` page, even if it's just a placeholder, so the redirects work. And a protected route component.

Let's refine the plan again.
1.  SQL to create `profiles` table and trigger.
2.  `src/lib/supabase.ts`
3.  `src/pages/Login.tsx`
4.  `src/pages/Register.tsx`
5.  `src/pages/Dashboard.tsx` (placeholder)
6.  `src/components/AuthLayout.tsx` (a protected route component)
7.  `src/hooks/useAuth.ts` (a hook to get session and user)
8.  Update `src/App.tsx` with all the new routes and the protected layout.
9.  Update `src/pages/Index.tsx` to be the landing page.

This is a more complete first step. It sets up the entire authentication flow.

`useAuth.ts` will be a simple context provider.
```typescript
// src/hooks/useAuth.tsx
import { Session, User } from '@supabase/supabase-js';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```
I'll rename the file to `src/providers/AuthProvider.tsx` to be more conventional. And the hook will be part of it.

`AuthLayout.tsx` will use this hook.
```typescript
// src/components/AuthLayout.tsx
import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const AuthLayout = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
```

Then in `App.tsx`, I'll wrap the `AuthProvider` around everything and set up the routes.

```typescript
// src/App.tsx (updated)
// ... imports
import { AuthProvider } from './providers/AuthProvider';
import { AuthLayout } from './components/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// ...
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
```
This looks solid. I'll proceed with creating these files.
The user mentioned sending registration data to an email. I can't implement that directly. I'll mention that this part requires a server-side function (like a Supabase Edge Function) and that I can set it up in a future step. For now, the data will be saved to the `profiles` table.

The user also mentioned "unicidade de cada cadastro". The `unique` constraint on the `cpf` column in the `profiles` table and Supabase Auth handling unique emails will take care of this.

I'll make sure to use `zod` and `react-hook-form` for the forms.
The registration form will need fields for:
- Nome Completo
- CPF
- Telefone
- Email
- Senha

The login form:
- Email
- Senha

I'll create the files now.Ótimo! Com o Supabase configurado, podemos começar a construir a base do seu aplicativo.

O primeiro passo é criar o sistema de autenticação para que os corretores possam se cadastrar e acessar a plataforma. Para isso, vou realizar as seguintes ações:

1.  **Configurar o Banco de Dados**: Vou criar uma tabela chamada `profiles` no Supabase para armazenar as informações dos corretores (nome, CPF, telefone) de forma segura.
2.  **Criar as Páginas de Autenticação**: Vou desenvolver a página de **Cadastro** (`/register`) e a de **Login** (`/login`).
3.  **Criar uma Página de Boas-Vindas**: Atualizarei a página inicial para direcionar os usuários para o login ou cadastro.
4.  **Estruturar as Rotas**: Vou configurar o sistema de navegação do aplicativo, incluindo uma rota protegida para o futuro painel de controle (`/dashboard`).

Vamos começar.

<lasy-execute-sql>
-- Criar a tabela para armazenar os perfis dos corretores
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  cpf TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar a Segurança em Nível de Linha (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Perfis são visíveis para todos os usuários.
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

-- Política: Usuários podem criar seu próprio perfil.
CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil.
CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Esta função (trigger) cria um perfil automaticamente quando um novo usuário se cadastra.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, cpf, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'cpf', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$;

-- Aciona a função sempre que um novo usuário é criado na autenticação.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
</lasy-execute-sql>
<lasy-write path="src/lib/supabase.ts" description="Criando o cliente Supabase para interagir com o backend.">
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);