import React, { useEffect, useState } from 'react';
import { explorerService } from '../services/explorerService';
import { Quote, RefreshCw } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export function QuotesWidget(): JSX.Element {
  const { t } = useTranslation();
  const [quote, setQuote] = useState<{ quote?: string; text?: string; author: string }>({
    quote: "If you don't believe it or don't get it, I don't have the time to try to convince you, sorry.",
    author: "Satoshi Nakamoto"
  });
  const [loading, setLoading] = useState<boolean>(false);

  const loadQuote = async () => {
    setLoading(true);
    try {
      const res = await explorerService.getRandomQuote();
      if (res && res.data) {
        setQuote(res.data);
      }
    } catch (e) {
      console.warn('Quote fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <Quote className="w-8 h-8 text-amber-500/40 shrink-0 mt-1" />
        <div className="flex-1">
          <p className="text-sm italic font-serif text-slate-200 leading-relaxed">
            "{quote.quote || quote.text}"
          </p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-mono font-bold text-amber-400">— {quote.author}</span>
            <button
              onClick={loadQuote}
              disabled={loading}
              title={t('nextQuoteBtn')}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5 text-xs font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('nextQuoteBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
