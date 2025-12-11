import React from 'react';
import { MindItem } from '../types';
import { ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';

interface DecisionMatrixProps {
  items: MindItem[];
  onComplete: (id: string) => void;
}

export const DecisionMatrix: React.FC<DecisionMatrixProps> = ({ items, onComplete }) => {
  const decisions = items.filter(i => !i.completed);

  if (decisions.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        No pending decisions. You are decisive!
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Decision Laboratory</h2>
      <div className="grid gap-8">
        {decisions.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{item.title}</h3>
                <p className="text-slate-500 mt-1">{item.summary}</p>
              </div>
              <button
                onClick={() => onComplete(item.id)}
                className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Archive Decision
              </button>
            </div>
            
            <div className="p-6 bg-slate-50/50">
              {item.decisionOptions && item.decisionOptions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {item.decisionOptions.map((opt, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col h-full">
                      <h4 className="font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-3">{opt.name}</h4>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="flex items-center text-xs font-bold text-green-600 uppercase tracking-wide mb-2">
                            <ThumbsUp size={12} className="mr-1" /> Pros
                          </span>
                          <ul className="space-y-1">
                            {opt.pros.map((p, i) => (
                              <li key={i} className="text-sm text-slate-600 pl-2 border-l-2 border-green-200">{p}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="flex items-center text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
                            <ThumbsDown size={12} className="mr-1" /> Cons
                          </span>
                          <ul className="space-y-1">
                            {opt.cons.map((c, i) => (
                              <li key={i} className="text-sm text-slate-600 pl-2 border-l-2 border-red-200">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 italic">
                  AI is analyzing options... No structured matrix available yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};