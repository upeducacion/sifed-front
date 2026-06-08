import StatusCard from "@/components/ui/status-card";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Acceso Restringido | UP Educación",
};

export default function ForbiddenPage() {
  return (
    <StatusCard
      icon={ShieldAlert}
      title="Acceso Restringido"
      description="No tienes los permisos necesarios para acceder a esta área del sistema. Si crees que es un error, contacta al administrador."
      color="red"
      actionLabel="Volver a mi perfil"
      actionHref="/login"
    />
  );
}
