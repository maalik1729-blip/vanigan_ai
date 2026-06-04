import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/vanigan/Navbar";
import {
  CategoryGrid, StatsSection, FeaturedBusinesses,
  CityExplorer, WhyVanigan, Testimonials, BlogPreview, CTABanner, Footer,
} from "@/components/vanigan/Sections";
import { ScrollProgress, ParallaxBand } from "@/components/vanigan/Effects";
import {
  LoadingSequence, ScreenTransition, FloatingNav, StickyStackCards,
  HorizontalScrollCarousel, AsymmetricSlider, WebGLField, RenderPresentation,
  MinimalistHierarchy, NonPodiumGrid,
} from "@/components/vanigan/Effects2";
import { ContactDock, SpatialHero } from "@/components/vanigan/Spatial";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vanigan.org — Tamil Nadu's Most Trusted Business Directory" },
      { name: "description", content: "Discover 18,424+ verified businesses across all 38 districts of Tamil Nadu. List your business free." },
      { property: "og:title", content: "Vanigan.org — Tamil Nadu's Business Directory" },
      { property: "og:description", content: "Discover verified businesses across Tamil Nadu. List your business free." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <LoadingSequence />
      <ScreenTransition />
      <ScrollProgress />
      <FloatingNav />
      <ContactDock />
      <Navbar />
      <SpatialHero />
      <CategoryGrid />
      <MinimalistHierarchy />
      <StatsSection />
      <NonPodiumGrid />
      <FeaturedBusinesses />
      <RenderPresentation />
      <ParallaxBand />
      <HorizontalScrollCarousel />
      <CityExplorer />
      <StickyStackCards />
      <WebGLField />
      <AsymmetricSlider />
      <WhyVanigan />
      <Testimonials />
      <BlogPreview />
      <CTABanner />
      <Footer />
    </main>
  );
}
