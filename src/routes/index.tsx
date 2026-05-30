import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/vanigan/Navbar";
import { Hero } from "@/components/vanigan/Hero";
import {
  CategoryGrid, HowItWorks, StatsSection, FeaturedBusinesses,
  CityExplorer, WhyVanigan, Testimonials, BlogPreview, CTABanner, Footer,
} from "@/components/vanigan/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vanigan.org — Tamil Nadu's Most Trusted Business Directory" },
      { name: "description", content: "Discover 12,000+ verified businesses, service providers, and professionals across all 38 districts of Tamil Nadu. List your business free." },
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
      <Navbar />
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <StatsSection />
      <FeaturedBusinesses />
      <CityExplorer />
      <WhyVanigan />
      <Testimonials />
      <BlogPreview />
      <CTABanner />
      <Footer />
    </main>
  );
}
