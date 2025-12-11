import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, Send, X, Loader2 } from 'lucide-react';
import { triageInput } from '../services/gemini';
import { MindItem } from '../types';

interface CaptureProps {
  onItemAdded: (item: MindItem) => void;
  onDone: () => void;
}

export const Capture: React.FC<CaptureProps> = ({ onItemAdded, onDone }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple speech recognition setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => prev + " " + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedImage) return;

    setIsProcessing(true);
    try {
      const result = await triageInput(text, selectedImage || undefined);
      
      const newItem: MindItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        originalInput: text,
        ...result,
        completed: false,
      };

      onItemAdded(newItem);
      setText('');
      setSelectedImage(null);
      onDone(); // Navigate back or show success
    } catch (error) {
      console.error("Failed to process:", error);
      alert("Failed to organize thought. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 h-full flex flex-col justify-center">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-slate-800 mb-2">Unload your mind</h2>
        <p className="text-slate-500">Just capture. We'll organize it for you.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 transition-all border border-slate-100">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind? (e.g., 'Need to choose a new laptop', 'Buy milk', 'Idea for a novel...')"
          className="w-full h-40 text-lg resize-none outline-none text-slate-700 placeholder:text-slate-300"
          disabled={isProcessing}
        />

        {selectedImage && (
          <div className="relative w-24 h-24 mb-4 group">
            <img src={selectedImage} alt="Upload" className="w-full h-full object-cover rounded-lg" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-4">
          <div className="flex space-x-2">
            <button 
              onClick={toggleListening}
              className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              title="Voice Note"
            >
              <Mic size={20} />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
              title="Upload Image"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing || (!text && !selectedImage)}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all
              ${(isProcessing || (!text && !selectedImage)) 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Thinking...
              </>
            ) : (
              <>
                Triage <Send className="ml-2" size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-slate-400">
        <div className="bg-slate-50 p-3 rounded-lg">
          <span className="block font-medium text-slate-600">Tasks</span>
          Added to your todo list
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <span className="block font-medium text-slate-600">Decisions</span>
          Comparisons generated
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <span className="block font-medium text-slate-600">Knowledge</span>
          Filed in your wiki
        </div>
      </div>
    </div>
  );
};