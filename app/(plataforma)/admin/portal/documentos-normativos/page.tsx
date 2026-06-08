import { Metadata } from "next";
import { DocumentosClient } from "./documentos-client";

export const metadata: Metadata = {
  title: "Gestión de Documentos Normativos | Admin UP Educación",
  description: "Administrar documentos normativos y formatos",
};

export default function DocumentosNormativosPage() {
  return <DocumentosClient />;
}
