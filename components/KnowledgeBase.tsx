import React from 'react';
import { MindItem } from '../types';
import { BookOpen, Tag } from 'lucide-react';

interface KnowledgeBaseProps {
  items: MindItem[];
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ items }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
       <h2 className="text-2xl font-bold text-slate-800 mb-6">External Mind</h2>
       <div className="grid gap-4">
         {items.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No knowledge snippets saved yet. Capture something to learn!
            </div>
         )}
         {items.map(item => (
           <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
             <div className="flex items-start gap-4">
               <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                 <BookOpen className="text-blue-600" size={20} />
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                 <p className="text-slate-600 mt-2 leading-relaxed">{item.summary}</p>
                 {item.tags && item.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-4">
                     {item.tags.map(tag => (
                       <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                         <Tag size={10} className="mr-1" /> {tag}
                       </span>
                     ))}
                   </div>
                 )}
                 <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400">
                   Captured on {new Date(item.createdAt).toLocaleDateString()}
                 </div>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};