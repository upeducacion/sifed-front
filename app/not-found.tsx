import StatusCard from "@/components/ui/status-card";
import { MapPinOff } from "lucide-react";

export const metadata = {
  title: "Página no encontrada | UP Educación",
};

export default function NotFound() {
  return (
    <StatusCard
      icon={MapPinOff}
      title="Página no encontrada"
      description="Lo sentimos, no pudimos encontrar la ruta que buscas dentro del campus virtual. Verifica la dirección o regresa al inicio."
      color="brand"
      actionLabel="Volver al Hub"
      actionHref="/login"
    />
  );
}
