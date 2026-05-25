import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Play, Pause, RefreshCw, Lock, ArrowRight } from 'lucide-react';

// Custom reusable components
import Sidebar from './components/Sidebar';
import TrustScoreRing from './components/TrustScoreRing';
import AnalysisProgressBar from './components/AnalysisProgressBar';
import EvidenceCard from './components/EvidenceCard';
import UploadZone from './components/UploadZone';
import ReportDocument from './components/ReportDocument';

// 3 Bug Fixes Integrations
import ScreenCaptureTab from './components/Fix1_ScreenCaptureTab';
import GuardianBubble from './components/Fix3_GuardianChat';
import { analyzeContent, analyzeUrl } from './Fix2_analysisEngine';

// Mock dataset
import { DEMO_BATCH } from './mockData';

/* =========================================================================
   1. Animated Neural Background (Canvas Blob Render)
   ========================================================================= */
const NeuralBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic fuzzy blobs
    const blobs = [
      { x: width * 0.3, y: height * 0.4, vx: 0.2, vy: 0.15, r: 240, color: 'rgba(0, 230, 130, 0.08)' },
      { x: width * 0.7, y: height * 0.6, vx: -0.15, vy: -0.2, r: 280, color: 'rgba(0, 207, 255, 0.06)' },
      { x: width * 0.5, y: height * 0.3, vx: -0.1, vy: 0.1, r: 200, color: 'rgba(168, 85, 247, 0.05)' }
    ];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.fillStyle = '#05080f';
      ctx.fillRect(0, 0, width, height);

      // Move & draw blobs
      blobs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
        if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;

        const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(5, 8, 15, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />;
};

/* =========================================================================
   2. Page 1: Landing Page ("/")
   ========================================================================= */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-8 overflow-hidden">
      <NeuralBackground />

      {/* Header Logo */}
      <header className="flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brandGreen to-brandCyan flex items-center justify-center font-display font-extrabold text-lg text-bg0">
            P
          </div>
          <span className="font-display text-lg font-black tracking-widest text-brandGreen">FAKEDETECTOR</span>
        </div>
      </header>

      {/* Hero Center */}
      <main className="flex-1 flex flex-col justify-center items-center text-center z-10 my-12">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl md:text-[108px] leading-[0.9] font-black uppercase text-white tracking-tight"
        >
          REAL MEDIA NEEDS<br />
          <span className="text-brandGreen drop-shadow-[0_0_35px_var(--green-glow)]">REAL PROOF.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-base md:text-lg text-text2 mt-6 max-w-[420px] leading-relaxed"
        >
          A simple way to find out what is real and what is fake. Secure, instantaneous, forensic-grade verification.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={() => navigate('/scan')}
          className="group mt-10 border border-brandGreen text-brandGreen font-display font-bold text-base px-10 py-3.5 rounded-xl tracking-[0.18em] transition-all relative overflow-hidden bg-transparent hover:bg-brandGreen hover:text-bg0 shadow-[0_0_20px_var(--green-glow)] hover:shadow-[0_0_35px_rgba(0,230,130,0.35)]"
        >
          START SCANNING
        </motion.button>
      </main>

      {/* Footer support icon */}
      <footer className="flex justify-between items-center text-[10px] text-text3 font-mono tracking-widest uppercase z-10">
        <span>© 2026 FakeDetector</span>
        <button 
          onClick={() => alert("FakeDetector Support Terminal: Diagnostic links are fully active.")}
          className="w-10 h-10 rounded-full border border-white/[0.04] bg-[#0b0f19]/40 flex items-center justify-center text-text3 hover:text-brandGreen hover:border-brandGreen/40 transition-all hover:scale-105"
        >
          💬
        </button>
      </footer>
    </div>
  );
};

/* =========================================================================
   3. Page 2: Main Scan Page ("/scan")
   ========================================================================= */
const MainScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'screen'>('upload');

  const handleFileSelect = (files: FileList) => {
    if (files.length > 0) {
      const filename = files[0].name;
      sessionStorage.setItem('activeScanFile', filename);
      sessionStorage.setItem('activeScanType', 'upload');
      
      // Execute smart analysis dynamic scoring
      const smartResult = analyzeContent({
        type: filename.toLowerCase().endsWith('.mp4') || filename.toLowerCase().endsWith('.mov') ? 'video' : 'image',
        filename: filename
      });
      sessionStorage.setItem('activeScanResult', JSON.stringify(smartResult));
      navigate('/scan/processing');
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* 2 Icon Tabs Container */}
      <div className="flex justify-center">
        <div className="bg-[#090d18] border border-white/[0.04] p-1.5 rounded-2xl flex gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2.5 rounded-xl font-body text-xs font-bold flex items-center gap-2 transition-all
              ${activeTab === 'upload' ? 'bg-brandGreen/10 text-brandGreen border border-brandGreen/15' : 'text-text3 hover:text-text2'}`}
          >
            🖼️ Image/Video
          </button>
          <button
            onClick={() => setActiveTab('screen')}
            className={`px-6 py-2.5 rounded-xl font-body text-xs font-bold flex items-center gap-2 transition-all
              ${activeTab === 'screen' ? 'bg-brandGreen/10 text-brandGreen border border-brandGreen/15' : 'text-text3 hover:text-text2'}`}
          >
            📺 Screen Capture
          </button>
        </div>
      </div>

      {/* Title area */}
      <div className="flex flex-col gap-2">
        <span className="text-mono text-[9px] uppercase tracking-[0.25em] text-text3 font-extrabold">
          INGESTION PORT
        </span>
        <h2 className="font-display text-6xl font-black text-white tracking-wide uppercase leading-none">
          FULL AI SCAN
        </h2>
        <p className="font-body text-sm text-text2 max-w-[500px]">
          Securely verify any digital file for synthetic anomalies, deepfake lip-sync masks, or vocoder voice clones.
        </p>
      </div>

      {/* Main interactive area depending on tabs */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-6">
          <UploadZone onFileSelect={handleFileSelect} />
        </div>
      )}

      {activeTab === 'screen' && (
        <ScreenCaptureTab />
      )}

      {/* Safety/Privacy footer */}
      <span className="text-mono text-[9px] uppercase tracking-wider text-text3 text-center mt-6">
        🔒 Files are encrypted and deleted after analysis. Zero media retention. GDPR / DPDP Compliant.
      </span>
    </div>
  );
};

/* =========================================================================
   4. Page 3: Processing screen ("/scan/processing")
   ========================================================================= */
const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const activeFile = sessionStorage.getItem('activeScanFile') || 'mock_file.mp4';
  const [circleFill, setCircleFill] = useState(0);

  useEffect(() => {
    // Fill up SVG Circle Ring over 3 seconds
    const interval = setInterval(() => {
      setCircleFill(prev => {
        if (prev >= 283) {
          clearInterval(interval);
          return 283;
        }
        return prev + 6;
      });
    }, 50);

    const timer = setTimeout(() => {
      navigate('/scan/result');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#05080f] flex flex-col items-center justify-center z-[9999] overflow-hidden">
      
      {/* Light Streak / Laser Scan lines */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-15">
        <div className="absolute left-[15%] w-0.5 h-1/4 bg-brandCyan blur-[2px] animate-[scanLine_4s_linear_infinite]" style={{ animationDelay: '0s' }} />
        <div className="absolute left-[45%] w-0.5 h-1/3 bg-brandGreen blur-[2px] animate-[scanLine_3.5s_linear_infinite]" style={{ animationDelay: '1s' }} />
        <div className="absolute left-[75%] w-0.5 h-1/4 bg-brandCyan blur-[2px] animate-[scanLine_4.5s_linear_infinite]" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-[90%] w-0.5 h-1/2 bg-brandGreen blur-[2px] animate-[scanLine_5s_linear_infinite]" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="flex flex-col items-center z-10">
        
        {/* Ring SVG counter */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="5"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#00e682"
              strokeWidth="5"
              strokeDasharray="351.8"
              strokeDashoffset={351.8 - (circleFill / 283) * 351.8}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0, 230, 130, 0.45))',
                transition: 'stroke-dashoffset 0.05s linear'
              }}
            />
          </svg>
          
          {/* Logo pulsing inside circle */}
          <div className="absolute font-display font-black text-5xl text-white tracking-widest animate-pulse opacity-90 select-none">
            FD
          </div>
        </div>

        <span className="text-mono mt-8 text-xs text-text2 uppercase tracking-[0.28em] font-extrabold animate-pulse">
          ANALYZING...
        </span>
        <span className="text-mono text-[9px] text-text3 font-bold mt-2 lowercase">
          scanning: {activeFile}
        </span>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: -50%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
   5. Page 4: Single Result Page ("/scan/result")
   ========================================================================= */
const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const activeFile = sessionStorage.getItem('activeScanFile') || 'mock_file.mp4';
  const [isPlaying, setIsPlaying] = useState(false);

  // Load smart computed dynamic analysis from session context
  const activeResult = JSON.parse(sessionStorage.getItem('activeScanResult') || 'null') || analyzeContent({ type: 'video', filename: activeFile });

  // Save scan to localStorage history automatically
  useEffect(() => {
    const pastScans = JSON.parse(localStorage.getItem('fakeDetectorHistory') || '[]');
    const isAlreadySaved = pastScans.some((s: any) => s.filename === activeFile);
    
    if (!isAlreadySaved) {
      const newScan = {
        id: "CASE-" + Math.floor(1000 + Math.random() * 9000),
        filename: activeFile,
        conclusion: activeResult.conclusion,
        aiProbability: activeResult.aiProbability,
        timestamp: new Date().toISOString(),
        type: activeFile.endsWith('.png') || activeFile.endsWith('.jpg') ? 'image' : 'video'
      };
      localStorage.setItem('fakeDetectorHistory', JSON.stringify([newScan, ...pastScans]));
    }
  }, [activeFile, activeResult]);

  const colorStyles = {
    red: {
      text: 'text-brandRed',
      border: 'border-brandRed/20',
      borderLeft: 'border-l-brandRed',
      glow: 'drop-shadow-[0_0_20px_rgba(255,61,90,0.35)]',
      bgGlow: 'shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(255,61,90,0.03)]'
    },
    green: {
      text: 'text-brandGreen',
      border: 'border-brandGreen/20',
      borderLeft: 'border-l-brandGreen',
      glow: 'drop-shadow-[0_0_20px_rgba(0,230,130,0.35)]',
      bgGlow: 'shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(0,230,130,0.03)]'
    },
    amber: {
      text: 'text-brandAmber',
      border: 'border-brandAmber/20',
      borderLeft: 'border-l-brandAmber',
      glow: 'drop-shadow-[0_0_20px_rgba(240,165,0,0.35)]',
      bgGlow: 'shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(240,165,0,0.03)]'
    },
    cyan: {
      text: 'text-brandCyan',
      border: 'border-brandCyan/20',
      borderLeft: 'border-l-brandCyan',
      glow: 'drop-shadow-[0_0_20px_rgba(0,207,255,0.35)]',
      bgGlow: 'shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(0,207,255,0.03)]'
    }
  }[activeResult.color as 'red' | 'green' | 'amber' | 'cyan'] || {
    text: 'text-brandGreen',
    border: 'border-brandGreen/20',
    borderLeft: 'border-l-brandGreen',
    glow: 'drop-shadow-[0_0_20px_rgba(0,230,130,0.35)]',
    bgGlow: 'shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(0,230,130,0.03)]'
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* Top Breadcrumbs & Nav Bar */}
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-5">
        <div className="flex items-center gap-2 text-mono text-[10px] text-text3 font-extrabold">
          <span>CASE // DIAGNOSTICS // {activeFile.toUpperCase()}</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/scan/report')}
            className="border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-text1 font-display font-bold text-xs tracking-wider px-6 py-2.5 rounded-xl transition-all"
          >
            ↑ EXPORT
          </button>
          <button 
            onClick={() => navigate('/scan')}
            className="bg-brandGreen hover:bg-brandGreen/90 text-bg0 font-display font-bold text-xs tracking-wider px-6 py-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(0,230,130,0.3)]"
          >
            NEW SCAN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-8">
        
        {/* LEFT COLUMN (40%): Conclusion and Bars */}
        <div className="flex flex-col gap-6">
          
          {/* CONCLUSION CARD */}
          <div className={`bg-[#0b0f19]/70 backdrop-blur-md border ${colorStyles.border} p-6 rounded-2xl relative overflow-hidden flex justify-between items-center ${colorStyles.bgGlow} border-l-4 ${colorStyles.borderLeft}`}>
            <div className="flex flex-col gap-2">
              <span className="text-mono text-[9px] uppercase tracking-wider text-text3 font-bold">CONCLUSION</span>
              <h3 className={`font-display text-6xl font-black ${colorStyles.text} tracking-wide leading-none uppercase ${colorStyles.glow}`}>
                {activeResult.conclusion}
              </h3>
              <p className="text-xs text-text2 leading-normal mt-2">
                {activeResult.conclusion === 'SYNTHETIC' 
                  ? 'Multiple indicators confirm this media was dynamically altered or synthetically synthesized by generative AI models.' 
                  : activeResult.conclusion === 'UNCERTAIN'
                    ? 'Linguistic or structural analysis is inconclusive. No absolute AI templates identified, but C2PA records are absent.'
                    : 'Verification models confirm the media holds authentic hardware acquisition tags and bio-metric spectral markers.'}
              </p>
            </div>
            
            <div className="flex flex-col items-center shrink-0">
              <TrustScoreRing score={activeResult.aiProbability} label="AI PROBABILITY" color={activeResult.color} size={90} />
            </div>
          </div>

          {/* DETAILED ANALYSIS SECTION */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h4 className="font-heading text-lg font-bold tracking-tight text-white uppercase">DETAILED ANALYSIS</h4>
              <span className="text-mono text-[9px] text-text3 uppercase font-bold tracking-wider">Layered signal verification</span>
            </div>

            {activeResult.analysisRows.map((row: any) => (
              <AnalysisProgressBar
                key={row.label}
                label={row.label}
                description={row.desc}
                value={row.value}
                color={activeResult.color}
              />
            ))}
          </div>

          {/* ADVICE BOX */}
          <div className="bg-[#0b0f19]/45 border border-white/[0.04] p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-mono text-[9px] uppercase tracking-wider text-brandAmber font-bold">ADVICE</span>
              <p className="text-xs text-text2 leading-relaxed">
                {activeResult.advice}
              </p>
            </div>
            <button 
              onClick={() => navigate('/scan/report')}
              className="w-full bg-[#121826]/80 hover:bg-[#182133]/90 text-text1 border border-white/[0.04] font-display text-xs tracking-wider py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              VIEW FULL REPORT
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (60%): Preview & Contextual Findings */}
        <div className="flex flex-col gap-6">
          
          {/* MEDIA PREVIEW CARD */}
          <div className="bg-[#0b0f19] border border-white/[0.04] rounded-3xl aspect-[16/10] relative flex items-center justify-center overflow-hidden shadow-2xl group">
            
            {/* Visual scan frame */}
            <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, rgba(5,8,15,0.8) 100%) pointer-events-none z-10" />
            
            {/* Simulated politician speaker outline */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-20">
              <div className="w-24 h-24 rounded-full bg-white/[0.08]" />
              <div className="w-44 h-24 rounded-[40px] bg-white/[0.08] mt-4" />
            </div>

            {/* Play Button Overlay */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full text-white flex items-center justify-center cursor-pointer border z-20 transition-all hover:scale-105 active:scale-95
                ${activeResult.isScam 
                  ? 'bg-brandRed border-brandRed/20 shadow-[0_0_30px_rgba(255,61,90,0.5)]' 
                  : 'bg-brandGreen border-brandGreen/20 shadow-[0_0_30px_rgba(0,230,130,0.5)]'}`}
            >
              {isPlaying ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" className="translate-x-0.5" />}
            </button>

            {/* Glowing Scan Box over lips */}
            <div className={`absolute bottom-1/4 w-32 h-14 border rounded-lg flex items-center justify-center animate-pulse z-10 
              ${activeResult.isScam 
                ? 'border-brandRed shadow-[0_0_20px_rgba(255,61,90,0.25)] text-brandRed' 
                : 'border-brandGreen shadow-[0_0_20px_rgba(0,230,130,0.25)] text-brandGreen'}`}
            >
              <span className="text-mono text-[8px] font-extrabold uppercase">
                {activeResult.isScam ? 'LIP_SYNC ERR' : 'BIOMETRIC OK'}
              </span>
            </div>

            <div className="absolute bottom-4 left-6 z-20 text-mono text-[9px] text-text3 font-semibold uppercase">
              {activeFile}
            </div>
          </div>

          {/* CONTEXTUAL FINDINGS */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xl font-bold tracking-tight text-white uppercase">Contextual Findings</h3>
            <p className="text-xs text-text2 leading-relaxed">
              {activeResult.contextualFindings}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {activeResult.evidenceCards.map((card: any, index: number) => (
                <EvidenceCard
                  key={index}
                  title={card.title}
                  timestamp={card.timestamp}
                  body={card.body}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

/* =========================================================================
   6. Page 5: Full Analysis Log ("/scan/report")
   ========================================================================= */
const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const activeFile = sessionStorage.getItem('activeScanFile') || 'mock_file.mp4';
  const caseId = "CASE-" + Math.floor(10000 + Math.random() * 90000);
  
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExportClick = () => {
    setShowModal(true);
  };

  const handleFormatConfirm = () => {
    setShowModal(false);
    setShowPicker(true);
  };

  const handleFolderConfirm = () => {
    setShowPicker(false);
    setShowSuccess(true);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* Breadcrumb nav */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/scan/result')}
          className="text-mono text-[10px] text-text3 font-extrabold hover:text-white transition-colors"
        >
          ◀ RETURN TO DIAGNOSTICS RESULT
        </button>
      </div>

      {/* Heading */}
      <div className="flex justify-between items-end border-b border-white/[0.04] pb-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-6xl font-black text-white leading-none uppercase">
            FULL<br />
            <span className="text-brandGreen drop-shadow-[0_0_20px_var(--green-glow)]">ANALYSIS LOG</span>
          </h2>
          
          {/* Token Hash Input field */}
          <div className="flex items-center gap-2 mt-4 bg-[#0b0f19]/70 border border-white/[0.04] px-4 py-2 rounded-xl text-mono text-xs text-text2 max-w-[280px]">
            <Lock size={12} className="text-brandGreen" />
            <span>digital_sovereignty_{caseId.toLowerCase()}</span>
          </div>
        </div>

        <button
          onClick={handleExportClick}
          className="bg-white hover:bg-white/90 text-bg0 font-display font-bold text-xs tracking-wider px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98]"
        >
          ↑ EXPORT PROTOCOL
        </button>
      </div>

      {/* Terminal report preview document */}
      <ReportDocument
        filename={activeFile}
        caseId={caseId}
        timestamp={new Date().toISOString()}
      />

      {/* MODAL 1: Choose Export Format */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-[#05080f]/90 backdrop-blur-md flex items-center justify-center z-[99999] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#090d18] border border-white/[0.06] p-6 rounded-2xl w-full max-w-[380px] text-center shadow-2xl"
            >
              <h3 className="font-display text-2xl font-bold uppercase mb-4 text-text1">Choose Export Format</h3>
              <p className="text-xs text-text2 mb-6">Select the data payload format to compile the official evidence report.</p>
              
              <div className="flex flex-col gap-2 mb-6">
                <button onClick={handleFormatConfirm} className="w-full bg-[#121826] hover:bg-[#1c2438] text-text1 text-xs font-semibold py-3 rounded-xl border border-white/[0.04] transition-colors">
                  📄 PDF Report Document
                </button>
                <button onClick={handleFormatConfirm} className="w-full bg-[#121826] hover:bg-[#1c2438] text-text1 text-xs font-semibold py-3 rounded-xl border border-white/[0.04] transition-colors">
                  📊 CSV Forensic Data Sheet
                </button>
                <button onClick={handleFormatConfirm} className="w-full bg-[#121826] hover:bg-[#1c2438] text-text1 text-xs font-semibold py-3 rounded-xl border border-white/[0.04] transition-colors">
                  🗂️ Raw JSON Metadata Digest
                </button>
              </div>

              <button onClick={() => setShowModal(false)} className="text-mono text-[9px] text-text3 uppercase font-bold hover:text-white transition-colors">
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Simulated Folder Picker */}
      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 bg-[#05080f]/90 backdrop-blur-md flex items-center justify-center z-[99999] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#090d18] border border-white/[0.06] p-6 rounded-2xl w-full max-w-[380px] shadow-2xl"
            >
              <h3 className="font-display text-2xl font-bold uppercase mb-4 text-text1 text-center">Select Destination Folder</h3>
              
              {/* Mock folder tree */}
              <div className="bg-[#05080f]/80 p-4 rounded-xl border border-white/[0.04] flex flex-col gap-2 text-xs font-mono text-text2 mb-6">
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  📁 Desktop
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors pl-4">
                  ↳ 📁 verifications_log
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  📁 Documents
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  📁 Downloads
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowPicker(false)} className="flex-1 bg-[#121826] text-text1 text-xs py-3 rounded-xl border border-white/[0.04] hover:bg-[#1a2338]">
                  Cancel
                </button>
                <button onClick={handleFolderConfirm} className="flex-1 bg-brandGreen text-bg0 font-display font-bold text-xs py-3 rounded-xl hover:shadow-[0_0_15px_rgba(0,230,130,0.3)]">
                  CONFIRM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Success message */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 bg-[#05080f]/90 backdrop-blur-md flex items-center justify-center z-[99999] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#090d18] border border-white/[0.06] p-6 rounded-2xl w-full max-w-[340px] text-center shadow-2xl"
            >
              <div className="w-12 h-12 bg-brandGreen/10 border border-brandGreen/25 rounded-full flex items-center justify-center text-brandGreen mx-auto mb-4">
                <Check size={20} />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase mb-2 text-text1">Report Saved Successfully</h3>
              <p className="text-xs text-text2 mb-6">Forensic evidence package was compiled and signed with digital sovereignty key hash.</p>
              
              <button 
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/scan');
                }}
                className="w-full bg-[#121826] text-text1 text-xs py-3 rounded-xl border border-white/[0.04] hover:bg-[#1c2438] transition-colors"
              >
                DISMISS
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* =========================================================================
   7. Page 6: Check Many Files ("/batch")
   ========================================================================= */
const BatchUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const handleFileSelect = (files: FileList) => {
    if (files.length > 0) {
      navigate('/batch/results');
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* centering pills */}
      <div className="flex justify-center">
        <div className="bg-[#090d18] border border-white/[0.04] p-1.5 rounded-2xl flex gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
          <button className="px-6 py-2.5 rounded-xl font-body text-xs font-bold bg-brandGreen/10 text-brandGreen border border-brandGreen/15">
            🖼️ Multi-Image / Video
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-6xl font-black text-white leading-none uppercase">
          CHECK MANY<br />
          <span className="text-brandGreen drop-shadow-[0_0_20px_var(--green-glow)]">FILES</span>
        </h2>
        <p className="font-body text-sm text-text2 max-w-[500px]">
          Upload several items simultaneously to run parallel verification models and audit coordinated networks.
        </p>
      </div>

      <UploadZone onFileSelect={handleFileSelect} isBatch={true} />

    </div>
  );
};

/* =========================================================================
   8. Page 7: Batch Results ("/batch/results")
   ========================================================================= */
const BatchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [revealedCount, setRevealedCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const startBatchCheck = () => {
    setIsScanning(true);
    setRevealedCount(0);
    
    // Staggered incremental reveal of 4 items with 800ms delays
    const interval = setInterval(() => {
      setRevealedCount(prev => {
        if (prev >= DEMO_BATCH.length) {
          clearInterval(interval);
          setIsScanning(false);
          return DEMO_BATCH.length;
        }
        return prev + 1;
      });
    }, 800);
  };

  useEffect(() => {
    startBatchCheck();
  }, []);

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white uppercase">CHECK MANY FILES</h2>
          <span className="text-mono text-[9px] text-text3 font-extrabold uppercase">4 FILES ADDED</span>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Forensic spreadsheet logged and downloaded successfully.")}
            className="border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-text1 font-display font-bold text-xs tracking-wider px-6 py-2.5 rounded-xl transition-all"
          >
            📊 DOWNLOAD SPREADSHEET
          </button>
          <button 
            onClick={() => alert("Batch reports pack signed and saved successfully.")}
            className="border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02] text-text1 font-display font-bold text-xs tracking-wider px-6 py-2.5 rounded-xl transition-all"
          >
            📋 DOWNLOAD REPORTS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* Left Column: File list */}
        <div className="flex flex-col gap-4">
          {DEMO_BATCH.slice(0, revealedCount).map((item) => {
            const isFake = item.result === 'FAKE';
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`bg-[#0b0f19]/70 border border-white/[0.04] backdrop-blur-md p-5 rounded-2xl flex justify-between items-center hover:border-white/[0.08] transition-all cursor-pointer group`}
                onClick={() => {
                  sessionStorage.setItem('activeScanFile', item.filename);
                  navigate('/scan/result');
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                    ${isFake 
                      ? 'bg-brandRed/10 text-brandRed border border-brandRed/20 shadow-[0_0_15px_rgba(255,61,90,0.1)]' 
                      : 'bg-brandGreen/10 text-brandGreen border border-brandGreen/20 shadow-[0_0_15px_rgba(0,230,130,0.1)]'}`}
                  >
                    {isFake ? <X size={14} /> : <Check size={14} />}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-heading text-sm font-bold text-text1 line-clamp-1">{item.filename}</h4>
                    <span className={`text-mono text-[9px] uppercase font-bold
                      ${isFake ? 'text-brandRed' : 'text-brandGreen'}`}
                    >
                      {isFake ? `FAKE // ${item.aiChance}% CHANCE OF AI` : `REAL // ${item.aiChance}% CHANCE OF AI`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] text-text3 font-semibold uppercase">CERTAINTY</div>
                    <div className="text-mono text-xs text-text2 font-bold">{item.certainty}%</div>
                  </div>

                  <span className="w-8 h-8 rounded-lg bg-[#121826]/80 text-text3 flex items-center justify-center transition-colors group-hover:text-white border border-white/[0.03]">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            );
          })}

          {revealedCount === 0 && (
            <div className="text-center font-mono text-[10px] text-text3 py-12 uppercase">
              Click Start Checking to initialize parallel threads...
            </div>
          )}
        </div>

        {/* Right Column: Progress panel */}
        <div className="bg-[#0b0f19]/70 border border-white/[0.04] backdrop-blur-md p-8 rounded-3xl flex flex-col gap-6 shadow-2xl h-fit">
          <div className="flex flex-col">
            <span className="text-mono text-[9px] text-text3 font-extrabold uppercase">PROGRESS STATUS</span>
            <h3 className="font-display text-[84px] font-black text-white leading-none mt-2">
              {Math.floor((revealedCount / DEMO_BATCH.length) * 100)}%
            </h3>
            <span className="text-mono text-[10px] text-text2 font-bold uppercase mt-2">
              COMPLETED {revealedCount}/{DEMO_BATCH.length} CHECKED
            </span>
          </div>

          {/* Full progress bar */}
          <div className="w-full h-1.5 bg-[#121826] rounded-full overflow-hidden">
            <div 
              className="h-full bg-brandGreen shadow-[0_0_10px_rgba(0,230,130,0.3)] transition-all duration-300"
              style={{ width: `${(revealedCount / DEMO_BATCH.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.04] py-4 my-2">
            <div className="text-center">
              <div className="text-[10px] text-text3 font-semibold uppercase">LIKELY FAKE</div>
              <div className="font-display text-4xl text-brandRed font-extrabold tracking-tight mt-1">2</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-text3 font-semibold uppercase">LIKELY REAL</div>
              <div className="font-display text-4xl text-brandGreen font-extrabold tracking-tight mt-1">2</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={startBatchCheck}
              disabled={isScanning}
              className="w-full bg-white hover:bg-white/90 text-bg0 font-display font-bold text-xs py-3.5 rounded-xl tracking-wider hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              ▶ START CHECKING
            </button>
            <button 
              onClick={() => setRevealedCount(0)}
              className="w-full border border-brandRed/20 hover:border-brandRed/40 text-brandRed bg-brandRed/5 hover:bg-brandRed/10 font-display text-xs py-3.5 rounded-xl tracking-wider transition-all"
            >
              🗑 CLEAR ALL
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

/* =========================================================================
   9. Page 8: Check Text ("/text")
   ========================================================================= */
const TextAnalysisPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [activeLang, setActiveLang] = useState('EN');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const langPills = ['EN', 'HI', 'TA', 'TE', 'BN'];

  const triggerTextAnalysis = () => {
    if (!inputText.trim()) {
      alert("Please paste text message context to verify.");
      return;
    }
    setIsChecking(true);
    setAnalysisResult(null);

    // Simulate RAG scanning delay of 1.5 seconds
    setTimeout(() => {
      setIsChecking(false);
      
      // Execute smart dynamic scoring
      const smartResult = analyzeContent({
        type: 'text',
        textContent: inputText
      });

      setAnalysisResult({
        risk: smartResult.conclusion === 'SYNTHETIC' ? 'Critical' : smartResult.conclusion === 'UNCERTAIN' ? 'Medium' : 'Low',
        prob: smartResult.aiProbability,
        reason: smartResult.contextualFindings,
        color: smartResult.color,
        chars: inputText.length
      });
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-6xl font-black text-white leading-none uppercase">
          TEXT<br />
          <span className="text-brandGreen drop-shadow-[0_0_20px_var(--green-glow)]">ANALYSIS</span>
        </h2>
        <p className="font-body text-sm text-text2 max-w-[500px]">
          Detect AI-generated text content, deceptive scam structures, and fake forwarded messages.
        </p>
      </div>

      {/* Large Input text card */}
      <div className="bg-[#0b0f19]/70 border border-white/[0.04] p-6 rounded-3xl flex flex-col gap-4">
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste any unverified SMS text, forwarded WhatsApp messages, article links here..."
          className="w-full min-h-[220px] bg-[#05080f]/80 border border-white/[0.04] focus:border-brandGreen/40 rounded-2xl p-5 text-sm text-text1 leading-relaxed placeholder-text3 focus:outline-none transition-colors resize-none"
        />

        <div className="flex justify-between items-center">
          {/* Language selector pills */}
          <div className="flex gap-1.5 bg-[#121826] p-1 rounded-xl border border-white/[0.03]">
            {langPills.map(l => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all
                  ${activeLang === l ? 'bg-brandGreen/10 text-brandGreen border border-brandGreen/15' : 'text-text3 hover:text-text2'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <span className="text-mono text-[9px] text-text3 font-semibold">
            {inputText.length} CHARACTERS
          </span>
        </div>
      </div>

      <button
        onClick={triggerTextAnalysis}
        disabled={isChecking}
        className="w-full bg-brandGreen hover:bg-brandGreen/90 text-bg0 font-display font-bold py-3.5 rounded-xl tracking-wider text-sm hover:shadow-[0_0_20px_rgba(0,230,130,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40"
      >
        {isChecking ? (
          <>
            <RefreshCw size={14} className="animate-spin" /> SCANNING LINGUISTIC SCHEMAS...
          </>
        ) : 'ANALYZE TEXT MESSAGE'}
      </button>

      {/* Analysis Results Display */}
      {analysisResult && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b0f19]/70 border border-white/[0.04] p-6 rounded-3xl backdrop-blur-md flex flex-col gap-6"
        >
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
            <div className="flex flex-col">
              <span className="text-mono text-[9px] text-text3 font-bold uppercase">DIAGNOSTIC VERDICT</span>
              <h3 className="font-heading text-xl font-bold tracking-tight text-white uppercase mt-1">Linguistic Scam Profile</h3>
            </div>
            
            <span className={`text-mono text-xs font-bold px-3 py-1 rounded-full uppercase border
              ${analysisResult.color === 'red' 
                ? 'bg-brandRed/10 text-brandRed border-brandRed/20' 
                : analysisResult.color === 'amber'
                  ? 'bg-brandAmber/10 text-brandAmber border-brandAmber/20'
                  : 'bg-brandGreen/10 text-brandGreen border-brandGreen/20'}`}
            >
              {analysisResult.risk} Risk Profile
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            <TrustScoreRing score={analysisResult.prob} label="AI CLONE THREAT" color={analysisResult.prob > 50 ? 'red' : 'green'} size={85} />
            
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-mono text-[8px] text-text3 font-bold uppercase">INTELLIGENCE REPORT SUMMARY</span>
              <p className="text-xs text-text2 leading-relaxed">{analysisResult.reason}</p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
};

/* =========================================================================
   10. Page 9: Audio Analysis ("/audio")
   ========================================================================= */
const AudioAnalysisPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState(0);

  const triggerMicToggle = () => {
    setIsRecording(!isRecording);
    setAudioFile(null);
    if (!isRecording) {
      // Simulate recording complete after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setAudioFile('voice_memo_raw_source.wav');
      }, 3000);
    }
  };

  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const step = () => {
        setTimeProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-6xl font-black text-white leading-none uppercase">
          AUDIO<br />
          <span className="text-brandGreen drop-shadow-[0_0_20px_var(--green-glow)]">ANALYSIS</span>
        </h2>
        <p className="font-body text-sm text-text2 max-w-[500px]">
          Analyze biological breath signatures, linear frequency voiceprints, and neural vocoder anomalies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Audio Box */}
        <UploadZone onFileSelect={(files) => {
          if (files.length > 0) setAudioFile(files[0].name);
        }} isBatch={false} />

        {/* Record mic Box */}
        <div className="bg-[#0b0f19]/70 border border-white/[0.04] backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div 
            onClick={triggerMicToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border transition-all duration-300 z-10
              ${isRecording 
                ? 'bg-brandRed text-white border-brandRed/20 animate-pulse shadow-[0_0_35px_rgba(255,61,90,0.5)]' 
                : 'bg-brandGreen/10 text-brandGreen hover:text-white hover:bg-brandGreen border-brandGreen/25 hover:shadow-[0_0_30px_rgba(0,230,130,0.3)] active:scale-95'}`}
          >
            🎤
          </div>

          <h3 className="font-display text-3xl font-extrabold uppercase mt-6 mb-1 text-text1">TAP TO RECORD</h3>
          <p className="text-xs text-text2 max-w-[220px] leading-relaxed">
            {isRecording ? 'Capturing live bio-acoustic frequency tracks...' : 'Capture live voice notes locally in our secure RAM sandbox.'}
          </p>
        </div>

      </div>

      {/* Waveform & analysis indicators */}
      {audioFile && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0b0f19]/70 border border-white/[0.04] p-6 rounded-3xl backdrop-blur-md flex flex-col gap-6"
        >
          {/* Waveform card */}
          <div className="bg-[#05080f]/90 border border-white/[0.03] p-5 rounded-2xl flex flex-col gap-4">
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-brandCyan/10 text-brandCyan flex items-center justify-center border border-brandCyan/20 hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={14} fill="#00cfff" /> : <Play size={14} fill="#00cfff" />}
              </button>

              <div className="text-right text-mono text-[9px] text-text3 font-semibold uppercase">
                {audioFile}
              </div>
            </div>

            {/* Simulated Scope Waveform */}
            <div className="h-16 relative flex items-center overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 100">
                <path
                  d="M0,50 Q100,20 200,80 T400,30 T600,70 T800,50"
                  fill="none"
                  stroke="#121a2c"
                  strokeWidth="2"
                />
                <path
                  d="M0,50 Q100,20 200,80 T400,30 T600,70 T800,50"
                  fill="none"
                  stroke="#00cfff"
                  strokeWidth="3.5"
                  strokeDasharray="800"
                  strokeDashoffset={800 - (timeProgress / 100) * 800}
                  className="transition-all duration-100 ease-linear"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(0, 207, 255, 0.4))' }}
                />
              </svg>
              {/* Highlight scam overlay marker */}
              <div className="absolute left-[45%] w-24 h-full bg-brandRed/10 border-l border-r border-brandRed/20 pointer-events-none" />
            </div>

            <div className="flex justify-between text-mono text-[8px] text-text3 font-bold uppercase">
              <span>00:00</span>
              <span className="text-brandRed">00:04 (Suspicious speech footprint)</span>
              <span>00:08</span>
            </div>
          </div>

          {/* Forensic Parameters Rings */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-t border-white/[0.04] mt-2">
            <TrustScoreRing score={97} label="Voice Authenticity" color="red" size={80} />
            <TrustScoreRing score={94} label="Synthetic Smoothness" color="red" size={80} />
            <TrustScoreRing score={88} label="Prosody Mismatch" color="red" size={80} />
            <TrustScoreRing score={91} label="Glottal IAIF Flatness" color="red" size={80} />
          </div>
        </motion.div>
      )}

    </div>
  );
};

/* =========================================================================
   11. Page 10: Your History ("/history")
   ========================================================================= */
const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('fakeDetectorHistory') || '[]');
    setHistoryList(list);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('fakeDetectorHistory');
    setHistoryList([]);
  };

  const filteredList = historyList.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'VIDEO') return item.type === 'video';
    if (activeFilter === 'IMAGE') return item.type === 'image';
    if (activeFilter === 'SCAMS CAUGHT') return item.conclusion === 'FAKE';
    return true;
  });

  const filters = ['ALL', 'VIDEO', 'IMAGE', 'AUDIO', 'TEXT', 'SCAMS CAUGHT'];

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      <div className="flex justify-between items-center border-b border-white/[0.04] pb-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white uppercase">Verification Logs</h2>
          <span className="text-mono text-[9px] text-text3 font-extrabold uppercase">YOUR SECURED HISTORY</span>
        </div>
        
        {historyList.length > 0 && (
          <button 
            onClick={clearHistory}
            className="border border-brandRed/20 bg-brandRed/5 hover:bg-brandRed/10 text-brandRed font-display text-xs tracking-wider px-6 py-2.5 rounded-xl transition-all"
          >
            CLEAR LOGS
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all
              ${activeFilter === f ? 'bg-brandGreen/10 text-brandGreen border border-brandGreen/15' : 'text-text3 hover:text-text2 bg-[#090d18] border border-white/[0.03]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List items */}
      <div className="flex flex-col gap-4">
        {filteredList.map((item, index) => {
          const isFake = item.conclusion === 'FAKE';
          
          return (
            <div
              key={index}
              onClick={() => {
                sessionStorage.setItem('activeScanFile', item.filename);
                navigate('/scan/result');
              }}
              className="bg-[#0b0f19]/70 border border-white/[0.04] p-5 rounded-2xl flex justify-between items-center hover:border-white/[0.08] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl bg-white/[0.02] border border-white/[0.04] w-10 h-10 rounded-xl flex items-center justify-center">
                  {item.type === 'video' ? '▶️' : '🖼️'}
                </span>
                
                <div className="flex flex-col gap-1">
                  <h4 className="font-heading text-sm font-bold text-text1 line-clamp-1">{item.filename}</h4>
                  <p className="text-[10px] text-text3 font-semibold uppercase">
                    {new Date(item.timestamp).toLocaleString()} • {item.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded border
                  ${isFake 
                    ? 'bg-brandRed/10 text-brandRed border-brandRed/20' 
                    : 'bg-brandGreen/10 text-brandGreen border-brandGreen/20'}`}
                >
                  {item.conclusion} {item.aiProbability}%
                </span>

                <span className="w-8 h-8 rounded-lg bg-[#121826]/80 text-text3 flex items-center justify-center group-hover:text-white border border-white/[0.03]">
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-[#0b0f19]/45 border border-white/[0.04] rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <span className="text-4xl text-text3 mb-4 select-none opacity-40">🛡️</span>
            <h3 className="font-display text-2xl font-bold uppercase mb-1 text-text2">No history logged yet</h3>
            <p className="text-xs text-text3 max-w-[280px] leading-relaxed mb-6">
              Start parsing dynamic unverified content to populate your secured local diagnostic ledger.
            </p>
            <button 
              onClick={() => navigate('/scan')}
              className="bg-brandGreen hover:bg-brandGreen/90 text-bg0 font-display font-bold text-xs tracking-wider px-8 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(0,230,130,0.3)] transition-all"
            >
              START SCANNING
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

/* =========================================================================
   12. Source Finder Page ("/source-finder")
   ========================================================================= */
const SourceFinderPage: React.FC = () => {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');

  const triggerUrlScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (urlInput.trim()) {
      sessionStorage.setItem('activeScanFile', urlInput);
      sessionStorage.setItem('activeScanType', 'url');
      
      // Execute smart analysis url scoring
      const smartResult = await analyzeUrl(urlInput);
      sessionStorage.setItem('activeScanResult', JSON.stringify(smartResult));
      navigate('/scan/processing');
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 ml-[240px] min-h-screen flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col gap-2">
        <span className="text-mono text-[9px] uppercase tracking-[0.25em] text-text3 font-extrabold">
          SOURCE FINDER
        </span>
        <h2 className="font-display text-6xl font-black text-white leading-none uppercase">
          RESOLVE REMOTE<br />
          <span className="text-brandGreen drop-shadow-[0_0_20px_var(--green-glow)]">DATA LINK</span>
        </h2>
        <p className="font-body text-sm text-text2 max-w-[500px]">
          Inspect remote articles, YouTube streams, WhatsApp forwards, or public press statement nodes to trace C2PA credential chains and detect neural voice clones.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0f19]/75 border border-white/[0.04] p-8 rounded-3xl backdrop-blur-md flex flex-col gap-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-brandGreen/10 text-brandGreen flex items-center justify-center border border-brandGreen/10 shadow-[0_0_20px_rgba(0,230,130,0.15)]">
          🔍
        </div>
        <h3 className="font-display text-3xl font-extrabold mb-1 uppercase text-text1">REMOTE DATA RESOLVER</h3>
        <p className="text-xs text-text2 max-w-[420px] mb-2 leading-relaxed">
          Verify digital authenticity by tracking dynamic links through decentralized intelligence databases.
        </p>

        <form onSubmit={triggerUrlScan} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Paste URL here — article, video link, social media post..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-[#05080f]/80 border border-white/[0.04] text-xs px-4 py-3.5 rounded-xl text-text1 placeholder-text3 focus:border-brandGreen/40 focus:outline-none transition-colors font-mono"
          />
          <button 
            type="submit"
            className="w-full bg-brandGreen hover:bg-brandGreen/90 text-bg0 font-display font-bold text-xs py-3.5 rounded-xl tracking-wider hover:shadow-[0_0_15px_rgba(0,230,130,0.3)] transition-all active:scale-95"
          >
            RESOLVE & ANALYZE LINK
          </button>
        </form>
      </motion.div>

    </div>
  );
};

/* =========================================================================
   13. Global Core Layout Component
   ========================================================================= */
const CoreLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || location.pathname === '/scan/processing';
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  // Monitor location changes and capture result contextually
  useEffect(() => {
    if (location.pathname === '/scan/result') {
      const activeFile = sessionStorage.getItem('activeScanFile') || 'mock_file.mp4';
      const activeResult = JSON.parse(sessionStorage.getItem('activeScanResult') || 'null');
      if (activeResult) {
        setCurrentAnalysis({
          conclusion: activeResult.conclusion,
          aiProbability: activeResult.aiProbability,
          filename: activeFile,
          isScam: activeResult.isScam
        });
      }
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#05080f]">
      {!hideSidebar && <Sidebar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/scan" element={<MainScanPage />} />
            <Route path="/scan/processing" element={<ProcessingPage />} />
            <Route path="/scan/result" element={<ResultPage />} />
            <Route path="/scan/report" element={<ReportPage />} />
            <Route path="/batch" element={<BatchUploadPage />} />
            <Route path="/batch/results" element={<BatchResultsPage />} />
            <Route path="/text" element={<TextAnalysisPage />} />
            <Route path="/audio" element={<AudioAnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/source-finder" element={<SourceFinderPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <GuardianBubble currentAnalysis={currentAnalysis} />
    </div>
  );
};

/* =========================================================================
   14. Master App Wrapper
   ========================================================================= */
export const App: React.FC = () => {
  return (
    <HashRouter>
      <CoreLayout />
    </HashRouter>
  );
};

export default App;
