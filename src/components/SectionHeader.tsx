import { motion } from "framer-motion";

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader = ({ number, title, subtitle, className = "" }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-8 md:mb-12 ${className}`}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span className="section-number">{number}</span>
        <span className="arrow-separator">→</span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-text-secondary text-base md:text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
