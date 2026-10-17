import SiteHeader from "@/components/landing/SiteHeader";
import Hero from "@/components/landing/Hero";
import SpecSheet from "@/components/landing/SpecSheet";
import UseCases from "@/components/landing/UseCases";
import Workflow from "@/components/landing/Workflow";
import Roadmap from "@/components/landing/Roadmap";
import SiteFooter from "@/components/landing/SiteFooter";

export default function Landing() {
  return (
    <div className="sheet min-h-screen">
      <div className="sheet-guides" aria-hidden="true">
        <div />
      </div>
      <SiteHeader />
      <main className="relative z-10">
        <Hero />
        <SpecSheet />
        <UseCases />
        <Workflow />
        <Roadmap />
      </main>
      <SiteFooter />
    </div>
  );
}
