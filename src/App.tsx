import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Network from "@/pages/Network";
import Sales from "@/pages/Sales";
import Training from "@/pages/Training";
import Rewards from "@/pages/Rewards";
import Admin from "@/pages/Admin";
import Documents from "@/pages/Documents";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/network" element={<Network />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/training" element={<Training />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/documents" element={<Documents />} />
            </Routes>
          </Layout>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;