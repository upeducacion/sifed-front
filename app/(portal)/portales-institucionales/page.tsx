import { Metadata } from "next";
import PortalesContent from "@/components/portal/portales/portales-content";

export const metadata: Metadata = {
  title: "Portales Institucionales | Facultad de Educación UNCP",
  description:
    "Accede a los principales portales de organismos de regulación, organismos internacionales, ciencia y tecnología, y la UNCP para fortalecer tu formación académica.",
};

export default function PortalesInstitucionalesPage() {
  return <PortalesContent />;
}
