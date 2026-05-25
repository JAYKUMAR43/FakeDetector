import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Search, FileText, Mic, History } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems: Array<{ label: string; path: string; icon: React.ReactNode; disabled?: boolean }> = [
    { label: '🏠 HOME', path: '/scan', icon: <Home size={16} /> },
    { label: '📋 CHECK MANY FILES', path: '/batch', icon: <FolderOpen size={16} /> },
    { label: '🔍 SOURCE FINDER', path: '/source-finder', icon: <Search size={16} /> },
    { label: '📝 CHECK TEXT', path: '/text', icon: <FileText size={16} /> },
    { label: '🎤 AUDIO ANALYSIS', path: '/audio', icon: <Mic size={16} /> },
    { label: '🕐 YOUR HISTORY', path: '/history', icon: <History size={16} /> }
  ];

  return (
    <aside className="w-[240px] h-screen bg-[#090d18] border-r border-white/[0.06] flex flex-col fixed left-0 top-0 z-[100] shrink-0">
      
      {/* Brand Header */}
      <div className="p-6 flex flex-col justify-center border-b border-white/[0.04] bg-[#05080f]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brandGreen to-[#00cfff] flex items-center justify-center font-display font-black text-xl text-white shadow-[0_0_15px_rgba(0,230,130,0.3)] relative overflow-hidden group-hover:scale-105 transition-transform">
            FD
          </div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-wide text-white leading-none">FAKEDETECTOR</h1>
            <span className="text-[8px] uppercase tracking-[0.15em] text-brandGreen font-bold font-mono mt-1 block">
              ● SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activePath === item.path || (item.path === '/scan' && activePath.startsWith('/scan/'));
          
          return (
            <button
              key={item.label}
              disabled={item.disabled}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all relative border
                ${item.disabled 
                  ? 'opacity-40 cursor-not-allowed border-transparent text-text3' 
                  : isActive
                    ? 'bg-brandGreen/10 border-brandGreen/25 text-brandGreen font-extrabold shadow-[0_0_20px_rgba(0,230,130,0.04)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                    : 'border-transparent text-text2 hover:text-text1 hover:bg-white/[0.02]'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brandGreen rounded-r" />
              )}
              <span className={isActive ? 'text-brandGreen' : 'text-text3'}>{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
              {item.disabled && (
                <span className="text-[7px] bg-white/[0.04] text-text3 font-mono font-bold px-1.5 py-0.5 rounded ml-auto">SOON</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Start Scanning Trigger */}
      <div className="p-4 border-t border-white/[0.04] flex flex-col gap-3 bg-[#05080f]/20">
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-brandGreen hover:bg-brandGreen/90 hover:shadow-[0_0_20px_rgba(0,230,130,0.3)] text-bg0 font-display font-bold py-3 rounded-xl tracking-wider text-sm transition-all active:scale-[0.98]"
        >
          START SCANNING
        </button>
        <button 
          onClick={() => navigate('/')}
          className="text-center font-bold font-mono text-[9px] text-text3 hover:text-text1 tracking-wider uppercase transition-colors py-1"
        >
          CLOSE MENU
        </button>
      </div>

    </aside>
  );
};
export default Sidebar;
