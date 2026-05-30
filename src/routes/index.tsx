import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/vanigan/Navbar";
import { Hero } from "@/components/vanigan/Hero";
import {
  CategoryGrid, HowItWorks, StatsSection, FeaturedBusinesses,
  CityExplorer, WhyVanigan, Testimonials, BlogPreview, CTABanner, Footer,
} from "@/components/vanigan/Sections";
import { ScrollProgress, MegaMarquee, ParallaxBand, StickyStatement } from "@/components/vanigan/Effects";
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
      { name: "description", content: "Discover 12,000+ verified businesses across all 38 districts of Tamil Nadu. List your business free." },
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
      <Navbar />
      <Hero />
      <MegaMarquee words={["Discover", "Connect", "Grow", "Tamil Nadu"]} outlined />
      <CategoryGrid />
      <MinimalistHierarchy />
      <HowItWorks />
      <MegaMarquee words={["12,000+ Businesses", "38 Districts", "Verified"]} reverse outlined dark />
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
      <StickyStatement />
      <WhyVanigan />
      <Testimonials />
      <BlogPreview />
      <CTABanner />
      <Footer />
    </main>
  );
}
