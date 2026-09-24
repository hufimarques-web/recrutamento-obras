import Header from "@/components/Header";
import KitchenSequence from "@/components/KitchenSequence";
import Philosophy from "@/components/Philosophy";
import Professions from "@/components/Professions";
import HowItWorks from "@/components/HowItWorks";
import ExperienceValue from "@/components/ExperienceValue";
import NextOpportunity from "@/components/NextOpportunity";
import CandidaturaReveal from "@/components/CandidaturaReveal";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#E0C097] selection:text-black">
      <Header />
      <KitchenSequence />
      <Philosophy />
      <Professions />
      <HowItWorks />
      <ExperienceValue />
      <NextOpportunity />
      <CandidaturaReveal />
      <FinalCTA />
      <Footer />
    </main>
  );
}
