import React, { useState } from 'react';
import { BrainCircuit, Mic, LayoutDashboard, Sparkles, ArrowRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your External Brain",
      description: "Stop juggling thoughts in your head. Cognitive Load Manager is designed to capture, structure, and delegate your mental clutter so you can focus on what matters.",
      icon: <BrainCircuit size={48} className="text-indigo-600" />,
      color: "bg-indigo-100"
    },
    {
      title: "Ambient Capture",
      description: "Dump everything here. Voice notes, messy texts, or screenshots of things you want to remember. Don't worry about organizing it yet—just get it out of your head.",
      icon: <Mic size={48} className="text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      title: "AI Triage & Structure",
      description: "Our AI analyzes your input. Action items become Tasks. Confusing choices become Decision Matrices with Pros/Cons. Facts go into your Knowledge Base.",
      icon: <Sparkles size={48} className="text-purple-600" />,
      color: "bg-purple-100"
    },
    {
      title: "The Empty Inbox",
      description: "We hide the clutter. The Focus Dashboard shows you only the single most important thing to handle right now based on urgency and energy.",
      icon: <LayoutDashboard size={48} className="text-emerald-600" />,
      color: "bg-emerald-100"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Graphic Area */}
        <div className={`h-48 ${steps[step].color} flex items-center justify-center transition-colors duration-500`}>
          <div className="bg-white p-6 rounded-full shadow-lg transform transition-all duration-500 hover:scale-110">
            {steps[step].icon}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col flex-1 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{steps[step].title}</h2>
          <p className="text-slate-500 leading-relaxed mb-8 min-h-[80px]">
            {steps[step].description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-indigo-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-auto">
            <button 
              onClick={onComplete}
              className={`text-sm font-medium text-slate-400 hover:text-slate-600 px-4 py-2 ${step === steps.length - 1 ? 'invisible' : ''}`}
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center"
            >
              {step === steps.length - 1 ? (
                <>Get Started <Check size={18} className="ml-2" /></>
              ) : (
                <>Next <ArrowRight size={18} className="ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};