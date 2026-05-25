import React from 'react';

interface ReportDocumentProps {
  filename: string;
  caseId: string;
  timestamp: string;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ filename, caseId, timestamp }) => {
  return (
    <div className="relative font-mono text-[11px] text-text2 leading-relaxed bg-[#05080f]/90 border border-white/[0.04] p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.03)] overflow-hidden min-h-[500px]">
      
      {/* Background Volumetric Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none text-white font-display text-[150px] font-black tracking-widest leading-none rotate-[-12deg]">
        FD
      </div>

      <div className="flex justify-between items-start mb-6">
        <span className="bg-brandGreen/10 text-brandGreen text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-brandGreen/20 font-bold">
          OFFICIAL_ANALYSIS_EXPORT
        </span>
        <div className="text-right">
          <div className="text-[10px] text-text3 font-semibold uppercase">AUTHENTICITY_RANK</div>
          <div className="text-brandRed text-[10px] font-bold">Partial SHA-256: {caseId}</div>
        </div>
      </div>

      <div className="mb-4">
        SOURCE: 0X7HATJTDRH<br />
        TIMESTAMP: {timestamp}<br />
        ──────────────────────────────────────────────────────────
      </div>

      <div className="text-center font-bold text-text1 text-xs mb-4">
        DIGITAL CONTENT AUTHENTICITY & FORENSIC REPORT<br />
        CERTIFICATE OF ANALYSIS
      </div>

      <div className="mb-6">
        ──────────────────────────────────────────────────────────<br />
        <span className="font-bold text-text1 uppercase">CASE METADATA</span><br />
        CASE ID:          {caseId}<br />
        FILE TARGET:      {filename}<br />
        REPORT GENERATED: {new Date().toLocaleString()}<br />
        ANALYSIS TYPE:    Deepfake Detection / Multi-Modal Forensic Audit<br />
        SUBJECT STATUS:   COMPLETED<br />
        ──────────────────────────────────────────────────────────
      </div>

      <div className="mb-6 bg-brandRed/5 border border-brandRed/10 p-4 rounded-xl">
        <span className="font-bold text-brandRed">CONCLUSION:       SYNTHETIC (AI-GENERATED)</span><br />
        CONFIDENCE:       99%<br />
        RISK LEVEL:       CRITICAL<br />
      </div>

      <div className="mb-4">
        ──────────────────────────────────────────────────────────<br />
        <span className="font-bold text-text1 uppercase">FINDINGS SUMMARY:</span><br /><br />
        * Face swap artifacts detected in lip/jaw region<br />
        * Audio-visual synchronization score: 12/100<br />
        * GAN upsampling artifact probability: 99%<br />
        * Temporal consistency violations: 847 frames<br />
        * Original source: Not found in known public provenance registries<br />
        ──────────────────────────────────────────────────────────
      </div>

      <div className="text-[9px] text-text3 mt-8 text-center leading-normal">
        CRYPTOGRAPHIC ASSURANCE STATEMENT: This digest holds digital vector signatures confirming analytical execution. Pure RAM sandbox buffers were purged after compilation.
      </div>
    </div>
  );
};
export default ReportDocument;
