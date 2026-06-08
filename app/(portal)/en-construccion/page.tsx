import StatusCard from "@/components/ui/status-card";
import { HardHat } from "lucide-react";

export const metadata = {
  title: "Página en Construcción | UP Educación",
};

export default function EnConstruccionPage() {
  return (
    <StatusCard
      icon={HardHat}
      title="Estamos trabajando"
      description="Esta sección estará disponible muy pronto. Estamos construyendo una mejor experiencia académica para ti."
      color="gold"
      actionLabel="Volver al Portal"
      actionHref="/"
    />
  );
}