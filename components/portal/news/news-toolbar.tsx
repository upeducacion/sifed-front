"use client";

import { Share2, Printer, Check } from "lucide-react";
import { useState } from "react";

export function NewsToolbar() {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <aside className="lg:w-16 flex lg:flex-col gap-4 items-center justify-center lg:justify-start lg:sticky lg:top-24 h-fit">
      <button 
        onClick={handleShare}
        className="h-10 w-10 rounded-full bg-neutral-100 hover:bg-brand-100 text-neutral-600 hover:text-brand-600 flex items-center justify-center transition-all active:scale-95" 
        title="Compartir"
      >
        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Share2 className="h-5 w-5" />}
      </button>
      
      <button 
        onClick={handlePrint}
        className="h-10 w-10 rounded-full bg-neutral-100 hover:bg-brand-100 text-neutral-600 hover:text-brand-600 flex items-center justify-center transition-all active:scale-95" 
        title="Imprimir"
      >
        <Printer className="h-5 w-5" />
      </button>
      
      <div className="hidden lg:block w-px h-12 bg-neutral-200 my-2"></div>
    </aside>
  );
}
