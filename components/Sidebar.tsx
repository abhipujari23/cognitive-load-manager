import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, PlusCircle, BrainCircuit, CheckSquare, Library } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'FOCUS', label: 'Focus', icon: LayoutDashboard },
    { id: 'CAPTURE', label: 'Capture', icon: PlusCircle },
    { id: 'TASKS', label: 'Tasks', icon: CheckSquare },
    { id: 'DECISIONS', label: 'Decisions', icon: BrainCircuit },
    { id: 'KNOWLEDGE', label: 'Knowledge', icon: Library },
  ];

  return (
    <div className="fixed bottom-0 w-full md:w-20 md:h-screen bg-white border-t md:border-t-0 md:border-r border-slate-200 flex md:flex-col justify-between items-center z-50">
      <div className="flex md:flex-col justify-around w-full md:h-full md:py-8">
        <div className="hidden md:flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
             <BrainCircuit className="text-white w-6 h-6" />
          </div>
        </div>

        <nav className="flex md:flex-col w-full md:space-y-4 px-2 md:px-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col md:flex-row items-center justify-center md:h-12 w-full transition-colors duration-200 group relative
                ${currentView === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <item.icon className={`w-6 h-6 md:w-6 md:h-6 mb-1 md:mb-0 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              <span className="text-[10px] md:hidden">{item.label}</span>
              {currentView === item.id && (
                <div className="hidden md:block absolute left-0 w-1 h-full bg-indigo-600 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};