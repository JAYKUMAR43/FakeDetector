import React, { useState } from 'react';
import { Shield, Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'How can I help you verify content today? Ask me about voice clones, lip-sync anomalies, or document scams.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');

    // Generate responsive AI response
    setTimeout(() => {
      let botText = "I've analyzed that parameter. FakeDetector maps neural traces on pixel structures to separate human physiological factors from synthetic clones. Would you like me to run an ELA compression scan?";
      if (userText.toLowerCase().includes('voice') || userText.toLowerCase().includes('audio')) {
        botText = "Acoustic audits evaluate glottal flows and prosodic variations using LFCC matrices. AI voice clones exhibit abnormally flat pitch jitter (<0.002) and no organic breath periods.";
      } else if (userText.toLowerCase().includes('video') || userText.toLowerCase().includes('fake')) {
        botText = "Deepfake video verification runs Farneback temporal optical flow checks to flag face swaps, combined with green channel rPPG forehead blood volume pulse tracking.";
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[320px] h-[400px] mb-4 bg-[#0b0f19]/90 border border-white/[0.06] backdrop-blur-2xl rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,230,130,0.05)]"
          >
            {/* Header */}
            <div className="bg-[#121826]/90 border-bottom border-white/[0.04] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen">
                  <Shield size={16} />
                </span>
                <div>
                  <h4 className="font-heading text-sm font-bold tracking-tight text-text1">FakeDetector Guardian</h4>
                  <span className="text-mono text-[9px] text-brandGreen font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brandGreen rounded-full animate-ping" /> ONLINE
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text3 hover:text-text1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed
                    ${msg.sender === 'user'
                      ? 'bg-brandGreen text-bg0 font-medium rounded-tr-none'
                      : 'bg-[#121826]/90 border border-white/[0.04] text-text2 rounded-tl-none'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/[0.04] bg-[#080b13]/80 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask FakeDetector Guardian..."
                className="flex-1 bg-[#121826] border border-white/[0.04] text-xs px-3 py-2 rounded-xl text-text1 placeholder-text3 focus:border-brandGreen/40 focus:outline-none transition-colors"
              />
              <button 
                type="submit"
                className="bg-brandGreen hover:bg-brandGreen/90 text-bg0 p-2 rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_10px_rgba(0,230,130,0.3)]"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-[#0b0f19] border border-brandGreen/30 hover:border-brandGreen flex items-center justify-center text-brandGreen hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(0,230,130,0.15)] group relative"
      >
        <MessageSquare size={20} className="group-hover:rotate-6 transition-transform" />
      </motion.button>
    </div>
  );
};
export default Chatbot;
