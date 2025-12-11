import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Capture } from './components/Capture';
import { FocusDashboard } from './components/FocusDashboard';
import { DecisionMatrix } from './components/DecisionMatrix';
import { KnowledgeBase } from './components/KnowledgeBase';
import { OnboardingModal } from './components/OnboardingModal';
import { MindItem, ViewState, ItemType } from './types';
import { CheckSquare, Trash2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('FOCUS');
  const [items, setItems] = useState<MindItem[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mind-items');
    if (saved) {
      setItems(JSON.parse(saved));
    }

    const onboardingCompleted = localStorage.getItem('onboarding-completed');
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mind-items', JSON.stringify(items));
  }, [items]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setShowOnboarding(false);
    setView('CAPTURE'); // Send them to capture first to try it out
  };

  const addItem = (item: MindItem) => {
    setItems(prev => [item, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Filter helpers
  const taskItems = items.filter(i => i.type === ItemType.TASK);
  const decisionItems = items.filter(i => i.type === ItemType.DECISION);
  const knowledgeItems = items.filter(i => i.type === ItemType.KNOWLEDGE);

  const navigateToDecision = (id: string) => {
    // For simplicity in this demo, just switching view to Decisions
    setView('DECISIONS');
  };

  const renderContent = () => {
    switch (view) {
      case 'CAPTURE':
        return <Capture onItemAdded={addItem} onDone={() => setView('FOCUS')} />;
      case 'FOCUS':
        return (
          <FocusDashboard 
            items={items} 
            onComplete={toggleComplete} 
            onNavigate={navigateToDecision} 
          />
        );
      case 'DECISIONS':
        return <DecisionMatrix items={decisionItems} onComplete={toggleComplete} />;
      case 'KNOWLEDGE':
        return <KnowledgeBase items={knowledgeItems} />;
      case 'TASKS':
        return (
          <div className="p-6 max-w-4xl mx-auto pb-24">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Task Queue</h2>
            <div className="space-y-3">
              {taskItems.length === 0 && <div className="text-slate-400">No tasks pending.</div>}
              {taskItems.map(item => (
                <div key={item.id} className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border ${item.completed ? 'opacity-50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleComplete(item.id)}
                      className={`p-2 rounded-full ${item.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <CheckSquare size={20} />
                    </button>
                    <div>
                      <h4 className={`font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.summary}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <FocusDashboard items={items} onComplete={toggleComplete} onNavigate={navigateToDecision} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <Sidebar currentView={view} setView={setView} />
      <main className="flex-1 md:ml-20 h-screen overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
}