"use client";

import { useState } from "react";
import { AuthService } from "@/lib/services/auth-service";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { User } from "@/hooks/use-auth";

interface LoginFormProps {
  onLoginSuccess: (userData: User) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await AuthService.login(email, password);
      
      if (result.success && result.user) {
        // Guardar solo metadata del usuario para la UI
        localStorage.setItem("user", JSON.stringify(result.user));
        
        onLoginSuccess(result.user);
      } else {
        setError("Error en la respuesta del servidor");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
         setError(err.message);
      } else {
         setError("Credenciales inválidas o error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-serif font-black text-brand-950 tracking-tighter">
          Acceso al <span className="text-brand-600">Campus Virtual</span>
        </h3>
        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5">
          Facultad de Educación - UP Educación
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10 flex items-start gap-2.5 text-destructive text-[11px] font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-[9px] font-black text-brand-950 uppercase tracking-widest ml-1"
        >
          Correo Institucional
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="usuario@uncp.edu.pe"
          className="w-full px-4 py-3.5 rounded-2xl border border-border bg-brand-50/30 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all placeholder:text-muted-foreground/50 font-medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between ml-1">
          <label
            htmlFor="password"
            className="text-[9px] font-black text-brand-950 uppercase tracking-widest"
          >
            Contraseña
          </label>
          <a
            href="#"
            className="text-[9px] font-black text-brand-600 hover:text-brand-800 transition-colors uppercase tracking-wider"
          >
            ¿Olvidaste tu clave?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3.5 rounded-2xl border border-border bg-brand-50/30 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all placeholder:text-muted-foreground/50 pr-12 font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-950 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center py-4.5 px-6 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-brand-600/20",
          loading
            ? "bg-brand-300 cursor-not-allowed"
            : "bg-brand-600 hover:bg-brand-950 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-950/20"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validando...
          </>
        ) : (
          "Ingresar a la Plataforma"
        )}
      </button>

      <div className="text-center pt-4 border-t border-brand-100">
        <p className="text-[10px] text-muted-foreground font-medium">
          ¿No tienes acceso?{" "}
          <a
            href="#"
            className="font-black text-brand-600 hover:text-brand-950 transition-colors uppercase tracking-tighter"
          >
            Solicita tu registro aquí
          </a>
        </p>
      </div>
    </form>
  );
}