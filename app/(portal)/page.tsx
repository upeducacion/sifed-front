import HeroSection from "@/components/home/hero-section";
import InstitutionalShowcase from "@/components/home/institutional-showcase";
import { NewsCollage } from "@/components/portal/news/news-collage";
import EcosistemaSection from "@/components/home/ecosistema-section";
import ProgramSelectorSection from "@/components/home/program-selector-section";
import PosgradoSection from "@/components/home/posgrado-section";
import InfoSection from "@/components/home/info-section";
import FAQSection from "@/components/home/faq-section";
import QuickAccessSection from "@/components/home/quick-access-section";
import SocialHubSection from "@/components/home/social-hub-section";
import NewsPopupModal from "@/components/home/news-popup-modal";
import { NoticiaService } from "@/lib/services/noticia-service";
import { Noticia } from "@/types/noticia";
import { MOCK_NOTICIAS } from "@/data/mock-noticias";

export default async function Home() {
  let popupNoticias: Noticia[] = [];

  try {
    const response = await NoticiaService.getAllPublic(1);
    const noticias = Array.isArray(response) ? response : (response?.data || []);

    const noticiasDestacadas = noticias.filter(
      (noticia) => noticia.estado === "publicado" && noticia.destacada
    );

    popupNoticias = [...MOCK_NOTICIAS, ...noticiasDestacadas];
  } catch (error) {
    console.error("Failed to fetch popup news on home:", error);

    popupNoticias = MOCK_NOTICIAS;
  }

  return (
    <>
      <NewsPopupModal noticias={popupNoticias} />

      <HeroSection />

      {/* VITRINA INSTITUCIONAL */}
      <InstitutionalShowcase />

      {/* OFERTA ACADÉMICA */}
      <PosgradoSection />
      
      {/* COMUNIDAD Y REDES */}
      <SocialHubSection />
      <FAQSection />
      <NewsCollage />
      <EcosistemaSection />
      <ProgramSelectorSection />
      <QuickAccessSection />

      <InfoSection />
    </>
  );
}