import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SdlFooter from "@/components/layout/sdl-footer";
import FloatingActions from "@/components/ui/floating-actions";
import { unidadPosgradoApi } from "@/lib/api/unidad-posgrado";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let whatsappNumber = "51949260658";
  
  try {
    const unidadData = await unidadPosgradoApi.getPublic();
    if (unidadData?.admision_json?.whatsapp_contacto) {
      whatsappNumber = unidadData.admision_json.whatsapp_contacto;
    }
  } catch (error) {
    console.error("Error fetching unidad data in layout:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-brand-600 selection:text-white">
      {/* HEADER MEGA MENU */}
      <Header />

      <main className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col">
        {children}
      </main>

      <Footer />
      <SdlFooter />
      
      {/* ACCIONES FLOTANTES (CONTACTO Y SCROLL) */}
      <FloatingActions whatsappNumber={whatsappNumber} />
    </div>
  );
}

