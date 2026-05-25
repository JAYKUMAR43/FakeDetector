import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisProgressBarProps {
  label: string;
  description: string;
  value: number;
  color: 'red' | 'green' | 'amber' | 'cyan';
}

export const AnalysisProgressBar: React.FC<AnalysisProgressBarProps> = ({
  label,
  description,
  value,
  color,
}) => {
  const colorMap = {
    red: 'bg-brandRed shadow-[0_0_10px_rgba(255,61,90,0.4)]',
    green: 'bg-brandGreen shadow-[0_0_10px_rgba(0,230,130,0.4)]',
    amber: 'bg-brandAmber shadow-[0_0_10px_rgba(240,165,0,0.4)]',
    cyan: 'bg-brandCyan shadow-[0_0_10px_rgba(0,207,255,0.4)]',
  };

  const textMap = {
    red: 'text-brandRed',
    green: 'text-brandGreen',
    amber: 'text-brandAmber',
    cyan: 'text-brandCyan',
  };

  return (
    <div className="bg-[#0b0f19]/70 backdrop-blur-md border border-white/[0.04] p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:border-white/[0.08]">
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-heading text-lg font-bold tracking-tight">{label}</span>
          <span className={`text-mono text-xs font-bold ${textMap[color]}`}>{value}%</span>
        </div>
        <p className="text-[11px] text-text2 line-clamp-1">{description}</p>
        
        {/* Progress bar track */}
        <div className="w-full h-1.5 bg-[#121826] rounded-full overflow-hidden mt-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${colorMap[color]}`}
          />
        </div>
      </div>
    </div>
  );
};
export default AnalysisProgressBar;
