import React from 'react';
import { motion } from 'framer-motion';

interface EvidenceCardProps {
  icon?: string;
  title: string;
  timestamp?: string;
  body: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  icon = "👁️",
  title,
  timestamp,
  body,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0b0f19]/70 backdrop-blur-md border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden flex flex-col gap-3 transition-all duration-300 hover:border-white/[0.08]"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-brandCyan text-xl bg-brandCyan/5 w-9 h-9 rounded-lg flex items-center justify-center border border-brandCyan/10 shadow-[0_0_15px_rgba(0,207,255,0.05)]">
            {icon}
          </span>
          <h4 className="font-heading text-base font-bold tracking-tight text-text1">{title}</h4>
        </div>
        {timestamp && (
          <span className="text-mono text-[10px] text-text3 font-semibold border border-white/[0.03] px-2 py-0.5 rounded bg-white/[0.01]">
            {timestamp}
          </span>
        )}
      </div>
      <p className="text-[12px] text-text2 leading-relaxed">{body}</p>
    </motion.div>
  );
};
export default EvidenceCard;
