import React from 'react';
import { MindItem, ItemType, Urgency } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface FocusDashboardProps {
  items: MindItem[];
  onComplete: (id: string) => void;
  onNavigate: (id: string) => void; // For deep diving into a decision
}

export const FocusDashboard: React.FC<FocusDashboardProps> = ({ items, onComplete, onNavigate }) => {
  // Logic to find the "One Thing"
  // Prioritize Uncompleted -> High Urgency -> Task/Decision
  const activeItems = items.filter(i => !i.completed);
  
  const focusItem = activeItems.sort((a, b) => {
    const urgencyScore = { [Urgency.HIGH]: 3, [Urgency.MEDIUM]: 2, [Urgency.LOW]: 1 };
    const typeScore = { [ItemType.TASK]: 3, [ItemType.DECISION]: 2, [ItemType.KNOWLEDGE]: 1 };
    
    const scoreA = urgencyScore[a.urgency] * 10 + typeScore[a.type];
    const scoreB = urgencyScore[b.urgency] * 10 + typeScore[b.type];
    
    return scoreB - scoreA; // Descending
  })[0];

  const pendingCount = activeItems.length;

  if (!focusItem) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">All Clear</h2>
        <p className="text-slate-500 max-w-md">
          Your mind is empty and your tasks are done. Enjoy the clarity.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pt-12 md:pt-24 h-full flex flex-col items-center">
      <div className="mb-4 inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
        Current Focus
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-8 leading-tight">
        {focusItem.title}
      </h1>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full 
          ${focusItem.urgency === Urgency.HIGH ? 'bg-red-500' : focusItem.urgency === Urgency.MEDIUM ? 'bg-amber-500' : 'bg-blue-500'}`} 
        />
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          {focusItem.summary}
        </p>

        <div className="flex flex-col gap-4">
          {focusItem.type === ItemType.DECISION && (
             <button
               onClick={() => onNavigate(focusItem.id)}
               className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-medium transition-colors flex items-center justify-center"
             >
               View Decision Matrix <ArrowRight size={18} className="ml-2" />
             </button>
          )}

          <button
            onClick={() => onComplete(focusItem.id)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center group"
          >
            <CheckCircle2 className="mr-2 group-hover:scale-110 transition-transform" />
            Mark as Done
          </button>
        </div>
        
        <div className="mt-6 flex justify-between items-center text-xs text-slate-400 font-medium uppercase tracking-wider">
           <span>{focusItem.type}</span>
           <span>Urgency: {focusItem.urgency}</span>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-sm">
        {pendingCount - 1} other items organized and waiting.
      </p>
    </div>
  );
};