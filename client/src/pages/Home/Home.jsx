import Hero from "../../components/Home/Hero";
import Features from "../../components/Home/Features";
import Stats from "../../components/Home/Stats";
import CTA from "../../components/Home/CTA";
import PageWrapper from "../../components/Common/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <Features />
      <Stats />
      <CTA />
    </PageWrapper>
  );
}