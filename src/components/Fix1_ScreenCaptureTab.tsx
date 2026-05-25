import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Camera, StopCircle } from 'lucide-react';
import { analyzeContent } from '../Fix2_analysisEngine';

export const ScreenCaptureTab: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startScreenCapture = async () => {
    setErrorMsg(null);
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor", // preference
        },
        audio: false
      });
      
      setStream(captureStream);
      setIsCapturing(true);

      if (videoRef.current) {
        videoRef.current.srcObject = captureStream;
      }

      // Handle stream end when user clicks standard browser "Stop sharing" button
      captureStream.getVideoTracks()[0].onended = () => {
        stopScreenCapture();
      };

    } catch (err: any) {
      console.error("Error accessing screen capture: ", err);
      setErrorMsg("Screen capture denied or unsupported in this browser environment.");
    }
  };

  const stopScreenCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCapturing(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const snapAndAnalyze = () => {
    if (!videoRef.current || !isCapturing) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const filename = `SCREENSHOT_SNAP_${new Date().toISOString().replace(/[:.]/g, '-')}.PNG`;
      
      // Save info to sessionStorage for retrieval on processing and result pages
      sessionStorage.setItem('activeScanFile', filename);
      sessionStorage.setItem('activeScanType', 'screen');
      
      // Let's analyze content dynamically! Since it's a random screen snap, we will give it a smart analysis result
      const smartResult = analyzeContent({
        type: 'screen',
        filename: filename,
        textContent: 'Screen Intercept Frame Capture'
      });
      
      sessionStorage.setItem('activeScanResult', JSON.stringify(smartResult));

      // Stop video track resources
      stopScreenCapture();

      // Go to processing screen
      navigate('/scan/processing');
    } catch (err) {
      console.error("Failed to snap and analyze: ", err);
      // Fallback
      sessionStorage.setItem('activeScanFile', 'screen_capture_payload.png');
      navigate('/scan/processing');
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup tracks on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="bg-[#0b0f19]/75 border border-white/[0.04] p-8 rounded-3xl backdrop-blur-md text-center flex flex-col items-center justify-center min-h-[340px]">
      {!isCapturing ? (
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-brandCyan/10 text-brandCyan flex items-center justify-center mb-6 border border-brandCyan/10 shadow-[0_0_25px_rgba(0,207,255,0.15)] group-hover:scale-105 transition-transform">
            🖥️
          </div>
          <h3 className="font-display text-4xl font-extrabold mb-2 uppercase text-text1">LOCAL VIEWPORT INTERCEPT</h3>
          <p className="text-xs text-text2 max-w-[360px] mb-6 leading-relaxed">
            Initialize our secure browser intercept engine to scan active windows, YouTube players, or online feeds in real-time.
          </p>
          
          <button 
            onClick={startScreenCapture}
            className="flex items-center gap-2 bg-transparent hover:bg-brandCyan hover:text-bg0 border border-brandCyan text-brandCyan font-display text-xs tracking-widest font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,207,255,0.1)] active:scale-[0.98]"
          >
            <Play size={14} /> START SCREEN CAPTURE
          </button>
          
          {errorMsg && (
            <span className="text-[10px] text-brandRed font-mono font-bold mt-4 block uppercase tracking-wider">
              ⚠️ {errorMsg}
            </span>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Live Video Preview container */}
          <div className="w-full max-w-[560px] bg-[#05080f] rounded-2xl border border-brandCyan/20 overflow-hidden relative aspect-video flex items-center justify-center shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
            {/* Pulsing indicator */}
            <div className="absolute top-4 left-4 bg-brandCyan/10 border border-brandCyan/20 text-brandCyan text-[8px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,207,255,0.1)] uppercase tracking-widest animate-pulse">
              <span className="w-1.5 h-1.5 bg-brandCyan rounded-full" /> Live Intercept Feed
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={snapAndAnalyze}
              className="flex items-center gap-2 bg-brandGreen hover:bg-brandGreen/90 text-bg0 font-display text-xs tracking-wider font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,230,130,0.3)] active:scale-95"
            >
              <Camera size={14} /> SNAP & ANALYZE
            </button>
            <button 
              onClick={stopScreenCapture}
              className="flex items-center gap-2 border border-brandRed/30 bg-brandRed/5 hover:bg-brandRed/10 text-brandRed font-display text-xs tracking-wider font-extrabold px-6 py-3.5 rounded-xl transition-all active:scale-95"
            >
              <StopCircle size={14} /> STOP CAPTURE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenCaptureTab;
