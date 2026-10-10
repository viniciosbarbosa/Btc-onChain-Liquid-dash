import React, { useState } from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Modal } from './ui/Modal';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
  title?: string;
  type?: 'address' | 'tx' | 'xpub' | 'asset' | 'general';
}

export function QRCodeModal({ isOpen, onClose, data, title, type = 'general' }: QRCodeModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(data)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<QrCode className="w-5 h-5 text-amber-400" />}
      title={title || t('qrCodeModalTitle')}
      subtitle={`Formato: ${type.toUpperCase()}`}
      maxWidth="sm"
    >
      <div className="text-center space-y-4">
        {/* QR Image Frame */}
        <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto border-4 border-slate-900">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            loading="eager"
          />
        </div>

        {/* Data Box */}
        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl break-all font-mono text-xs text-amber-300 max-h-24 overflow-y-auto">
          {data}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl transition text-xs font-mono shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
            {copied ? t('copied') : t('copyRaw')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
