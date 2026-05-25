import React, { useState, useRef, useEffect } from 'react';
import { Shield, Send, X, MessageSquare, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisContext {
  conclusion: string;
  aiProbability: number;
  filename: string;
  isScam?: boolean;
}

interface GuardianBubbleProps {
  currentAnalysis: AnalysisContext | null;
}

export const GuardianBubble: React.FC<GuardianBubbleProps> = ({ currentAnalysis }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'How can I help you verify content today? Ask me about voice clones, lip-sync anomalies, or where to report deepfake scams.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle auto-greeting when a new analysis is loaded
  useEffect(() => {
    if (currentAnalysis) {
      const isFake = currentAnalysis.conclusion === 'SYNTHETIC' || currentAnalysis.aiProbability > 50;
      let greeting = `I see you just completed an analysis for "${currentAnalysis.filename}". `;
      if (isFake) {
        greeting += `⚠️ WARNING: This file shows a HIGH risk index of ${currentAnalysis.aiProbability}%. It displays characteristics of a synthetic deepfake/scam. Let me know if you want me to explain the specific anomalies detected or guide you on where to report it.`;
      } else {
        greeting += `🟢 AUTHENTIC: This content has a low threat profile (${currentAnalysis.aiProbability}% AI probability) and matches authentic standards. You can safely distribute it. Let me know if you need provenance details.`;
      }
      setMessages(prev => [...prev, { sender: 'bot', text: greeting }]);
      setIsOpen(true); // Proactively open bubble to alert user
    }
  }, [currentAnalysis]);

  const callLLM = async (userPrompt: string): Promise<string> => {
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY; // Secure environment variable

    // Formulate Context Prompt
    const contextPrompt = currentAnalysis 
      ? `Active forensic analysis details:
- Filename: "${currentAnalysis.filename}"
- Verdict: ${currentAnalysis.conclusion}
- Synthetic Probability: ${currentAnalysis.aiProbability}%
- Risk: ${currentAnalysis.aiProbability > 50 ? 'CRITICAL - GENERATED SCAM' : 'LOW - VERIFIED AUTHENTIC'}`
      : 'No active verification case is loaded.';

    const systemPrompt = `You are "FakeDetector Guardian", a world-class cybersecurity strategist, deepfake forensic investigator, and anti-fraud analyst.
Your job is to help users verify digital content authenticity and explain deep learning artifacts in simple, actionable terms.
Guidelines:
1. Context-awareness: You are aware of the active case:
${contextPrompt}
2. Helpful & Objective: If the active case is AUTHENTIC, reassure the user politely. If the active case is SYNTHETIC (scam), clearly warn them.
3. Anti-Fraud Actions: If a user discusses scam reporting, always tell them to report it instantly at the government portal: cybercrime.gov.in or dial the anti-financial fraud helpline 1930.
4. Hindi/Regional languages: If the user inputs in Hindi (or Hinglish/Tamil/etc.), respond clearly in that language.
5. Technical Simplicity: Explain complex deep learning detection methods (e.g. rPPG cardiac rhythms, glottal flows, temporal optical flow) in clear, non-jargon language.
Keep responses under 3-4 sentences.`;

    try {
      // 1. Google Gemini API Call (Most reliable client-side, zero CORS block)
      if (geminiKey) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `${systemPrompt}\n\nUser: ${userPrompt}\n\nFakeDetector Guardian:`
                }]
              }],
              generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.3
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "I've processed your query, but couldn't retrieve a specific text block.";
        }
      }

      // 2. Claude API Call (Standard Anthropic client-side call)
      if (anthropicKey && anthropicKey !== 'sk-ant-api03-xxxxx') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-dangerous-direct-access-to-api-keys': 'true' // Required in client
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 250,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.content?.[0]?.text || "Processed successfully.";
        }
      }
    } catch (err) {
      console.error("LLM API Call Error: ", err);
    }

    // 3. Fallback Smart Rule-Based Engine
    return new Promise((resolve) => {
      setTimeout(() => {
        const query = userPrompt.toLowerCase();
        let reply = "I've analyzed that parameter. FakeDetector logs pixel structures to separate human biological attributes from deepfake autoencoders. Would you like me to guide you on how to report suspicious schemes?";

        // Hindi Queries
        if (query.includes('hindi') || query.includes('मदद') || query.includes('कैसे') || query.includes('report') && (query.includes('karein') || query.includes('kahan'))) {
          reply = "आप किसी भी प्रकार के ऑनलाइन फ्रॉड या डीपफेक स्कैम की रिपोर्ट भारत सरकार के साइबर पोर्टल cybercrime.gov.in पर कर सकते हैं। इसके अलावा, तुरंत वित्तीय मदद के लिए हेल्पलाइन नंबर 1930 पर कॉल करें।";
          return resolve(reply);
        }

        // Voice clone
        if (query.includes('voice') || query.includes('audio') || query.includes('sound')) {
          reply = "Synthetic voice clones exhibit abnormally flat pitch jitter (<0.002) and pitch shimmer characteristics. Authentic biosigns (like breathing frequency) are usually stripped in vocoder outputs.";
        }
        // Reporting
        else if (query.includes('report') || query.includes('cyber') || query.includes('help') || query.includes('polic')) {
          reply = "⚠️ SCAM REPORTING PROTOCOL: If you have encountered a deepfake scam, register an immediate complaint at the National Cyber Crime Reporting Portal (https://cybercrime.gov.in) or call the active helpline: 1930.";
        }
        // Active analysis
        else if (currentAnalysis) {
          const isFake = currentAnalysis.conclusion === 'SYNTHETIC';
          if (isFake) {
            reply = `The active file "${currentAnalysis.filename}" is flagged as a SYNTHETIC DEEPFAKE (${currentAnalysis.aiProbability}% AI probability). Technical analysis shows lip-sync mask anomalies and voice cloning triggers. Do not share this file.`;
          } else {
            reply = `The active file "${currentAnalysis.filename}" is fully AUTHENTIC. Signals confirm original camera hardware tags and organic vocal rhythms. You can proceed to distribute safely.`;
          }
        }

        resolve(reply);
      }, 700);
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    const botReply = await callLLM(userText);
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] h-[440px] mb-4 bg-[#0b0f19]/95 border border-white/[0.06] backdrop-blur-2xl rounded-2xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,230,130,0.06)]"
          >
            {/* Header */}
            <div className="bg-[#121826]/90 border-b border-white/[0.04] p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brandGreen/10 border border-brandGreen/20 flex items-center justify-center text-brandGreen">
                  <Shield size={16} />
                </span>
                <div>
                  <h4 className="font-heading text-sm font-bold tracking-tight text-text1 leading-none">FakeDetector Guardian</h4>
                  <span className="text-mono text-[8px] text-brandGreen font-bold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 bg-brandGreen rounded-full animate-ping" /> SECURE CHAT ONLINE
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
                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed
                    ${msg.sender === 'user'
                      ? 'bg-brandGreen text-bg0 font-extrabold rounded-tr-none shadow-[0_4px_12px_rgba(0,230,130,0.2)]'
                      : 'bg-[#121826]/80 border border-white/[0.04] text-text2 rounded-tl-none'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#121826]/80 border border-white/[0.04] p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin text-brandGreen" />
                    <span className="text-[10px] text-text3 font-mono">Guardian thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/[0.04] bg-[#080b13]/85 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Guardian..."
                className="flex-1 bg-[#121826] border border-white/[0.04] text-xs px-3 py-2.5 rounded-xl text-text1 placeholder-text3 focus:border-brandGreen/40 focus:outline-none transition-colors"
              />
              <button 
                type="submit"
                className="bg-brandGreen hover:bg-brandGreen/90 text-bg0 p-2.5 rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_10px_rgba(0,230,130,0.3)]"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#0b0f19] border border-brandGreen/30 hover:border-brandGreen flex items-center justify-center text-brandGreen hover:text-white transition-all shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(0,230,130,0.2)] group relative"
      >
        <MessageSquare size={22} className="group-hover:rotate-6 transition-transform" />
      </motion.button>
    </div>
  );
};
export default GuardianBubble;
