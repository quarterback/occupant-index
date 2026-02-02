import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import MemoCard from "@/components/MemoCard";

const Memos = () => {
  const memos = [
    {
      number: "OCC-2026-003",
      title: "The Escalation Problem: When AI Can't Say 'I Don't Know'",
      date: "Jan 2026",
      excerpt: "Decision systems require clear escalation paths. Current LLM deployments collapse this into a single probability distribution, creating brittleness at the edges of competence.",
      href: "/memos/escalation-problem",
      tag: "Trust Engineering",
    },
    {
      number: "OCC-2026-002",
      title: "Compute CPI Q4 Review: Judgment Costs Outpace Moore's Law",
      date: "Dec 2025",
      excerpt: "Despite hardware improvements, the cost of reliable AI judgment increased 12% YoY. The premium for trustworthy outputs is widening, not narrowing.",
      href: "/memos/q4-review",
      tag: "Index Report",
    },
    {
      number: "OCC-2026-001",
      title: "Decision Budgets: A Framework for AI-Augmented Governance",
      date: "Nov 2025",
      excerpt: "Introducing the decision budget framework. How organizations should think about allocating judgment authority between humans and AI systems.",
      href: "/memos/decision-budgets",
      tag: "Framework",
    },
    {
      number: "OCC-2025-011",
      title: "The Cognition Premium: Why Frontier Model Costs Won't Fall Like You Expect",
      date: "Oct 2025",
      excerpt: "Analysis of the widening spread between frontier and budget models. Capability stratification is creating a two-tier market with different economics.",
      href: "/memos/cognition-premium",
      tag: "Index Report",
    },
    {
      number: "OCC-2025-010",
      title: "Contestability Architecture: Designing for Human Override",
      date: "Sep 2025",
      excerpt: "Technical patterns for building AI systems that remain contestable. How to preserve meaningful human agency in automated decision pipelines.",
      href: "/memos/contestability",
      tag: "Trust Engineering",
    },
    {
      number: "OCC-2025-009",
      title: "Announcing Compute CPI",
      date: "Aug 2025",
      excerpt: "Introducing the Occupant Index: a public benchmark for the cost of AI work. Why we built it, how it works, and what it reveals.",
      href: "/memos/announcing-compute-cpi",
      tag: "Announcement",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="pt-32 md:pt-40 pb-16 section-padding border-b border-divider">
        <div className="content-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block mb-4">
              Research & Analysis
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Memos
            </h1>
            <p className="text-lg text-text-secondary">
              Public briefs from Occupant research. Index reports, frameworks, 
              and analysis for institutions navigating AI dependency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Memos List */}
      <section className="py-16 md:py-24 section-padding">
        <div className="content-max">
          <div className="max-w-3xl space-y-0">
            {memos.map((memo) => (
              <MemoCard
                key={memo.number}
                number={memo.number}
                title={memo.title}
                date={memo.date}
                excerpt={memo.excerpt}
                href={memo.href}
                tag={memo.tag}
              />
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-divider max-w-3xl">
            <p className="text-sm text-text-tertiary">
              Subscribe to receive new memos via email. We publish 2-4 pieces per month.
            </p>
            <form className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-divider bg-background font-mono text-sm focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-foreground text-background font-mono text-sm hover:bg-foreground/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Memos;
