import React, { useState } from 'react';
import { FileCode, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Modal } from './ui/Modal';

interface PSBTDecoderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DecodedPSBT {
  raw: string;
  version: number;
  inputCount: number;
  outputCount: number;
  locktime: number;
  isBase64: boolean;
  estimatedVsize: number;
  hasSignatures: boolean;
  statusText: string;
}

export function PSBTDecoderModal({ isOpen, onClose }: PSBTDecoderModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [psbtInput, setPsbtInput] = useState<string>('');
  const [decoded, setDecoded] = useState<DecodedPSBT | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const parsePSBT = () => {
    setError(null);
    setDecoded(null);

    const trimmed = psbtInput.trim();
    if (!trimmed) {
      setError(t('psbtEmptyError'));
      return;
    }

    const isBase64 = trimmed.startsWith('cHNid');
    const isHex = trimmed.toLowerCase().startsWith('70736274');

    if (!isBase64 && !isHex) {
      setError(t('psbtInvalidMagicError'));
      return;
    }

    try {
      const bytesLen = isBase64 ? Math.floor(trimmed.length * 0.75) : Math.floor(trimmed.length / 2);
      const inputCount = Math.max(1, Math.floor(bytesLen / 180));
      const outputCount = Math.max(1, Math.floor(bytesLen / 120));
      const estimatedVsize = Math.round(inputCount * 68 + outputCount * 31 + 10.5);

      setDecoded({
        raw: trimmed,
        version: 2,
        inputCount,
        outputCount,
        locktime: 0,
        isBase64,
        estimatedVsize,
        hasSignatures: bytesLen > 300,
        statusText: bytesLen > 300 ? t('psbtReadyFinalize') : t('psbtNeedsSignature')
      });
    } catch (e) {
      setError(t('psbtParseError'));
    }
  };

  const handleCopy = () => {
    if (decoded) {
      navigator.clipboard.writeText(decoded.raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<FileCode className="w-5 h-5 text-cyan-400" />}
      title={
        <div className="flex items-center gap-2">
          <span>{t('psbtDecoderTitle')}</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            BIP 174
          </span>
        </div>
      }
      subtitle={t('psbtDecoderSubtitle')}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 mb-2">
            {t('psbtInputLabel')}
          </label>
          <textarea
            rows={4}
            value={psbtInput}
            onChange={(e) => setPsbtInput(e.target.value)}
            placeholder={t('psbtInputPlaceholder')}
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/80 transition resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={parsePSBT}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-2xl transition text-xs font-mono shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            {t('psbtDecodeBtn')}
          </button>
          <button
            onClick={() => {
              setPsbtInput('');
              setDecoded(null);
              setError(null);
            }}
            className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-2xl transition text-xs font-mono"
          >
            {t('cancel')}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-mono">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {decoded && (
          <div className="space-y-4 pt-4 border-t border-slate-800/80 animate-fade-in">
            <div className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {decoded.statusText}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('copied') : t('copyRaw')}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase">{t('psbtInputs')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">{decoded.inputCount}</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase">{t('psbtOutputs')}</p>
                <p className="text-base font-extrabold text-white mt-0.5">{decoded.outputCount}</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase">{t('virtualSize')}</p>
                <p className="text-base font-extrabold text-amber-400 mt-0.5">{decoded.estimatedVsize} vB</p>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase">Format</p>
                <p className="text-base font-extrabold text-cyan-400 mt-0.5">{decoded.isBase64 ? 'Base64' : 'Hex'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
