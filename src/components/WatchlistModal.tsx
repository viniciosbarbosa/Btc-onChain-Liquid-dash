import React, { useState } from 'react';
import { Star, Trash2, ExternalLink, Tag, Plus, Search } from 'lucide-react';
import { useWatchlist, WatchlistItem } from '../context/WatchlistContext';
import { useTranslation } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WatchlistModal({ isOpen, onClose }: WatchlistModalProps): JSX.Element | null {
  const { items, removeItem, addItem } = useWatchlist();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [newId, setNewId] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [newType, setNewType] = useState<WatchlistItem['type']>('address');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newId.trim()) {
      addItem({
        id: newId.trim(),
        label: newLabel.trim() || newId.trim().slice(0, 10) + '...',
        type: newType,
      });
      setNewId('');
      setNewLabel('');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleNavigate = (item: WatchlistItem) => {
    onClose();
    if (item.type === 'address') navigate(`/address/${item.id}`);
    else if (item.type === 'tx') navigate(`/tx/${item.id}`);
    else if (item.type === 'xpub') navigate(`/xpub/${item.id}`);
    else if (item.type === 'asset') navigate(`/asset/${item.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
      title={
        <div className="flex items-center gap-2">
          <span>{t('watchlistTitle')}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            {items.length} {t('itemsSaved')}
          </span>
        </div>
      }
      subtitle={t('watchlistSubtitle')}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Add New Item Form */}
        <form onSubmit={handleAddNew} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Plus className="w-4 h-4" />
            <span>{t('addFavoriteBtn')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder={t('addressTxPlaceholder')}
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="sm:col-span-2 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as WatchlistItem['type'])}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="address">Address</option>
              <option value="tx">Transaction</option>
              <option value="xpub">XPUB</option>
              <option value="asset">Liquid Asset</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('labelPlaceholder')}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs font-mono transition"
            >
              {t('saveBtn')}
            </button>
          </div>
        </form>

        {/* Search Filter */}
        {items.length > 0 && (
          <div className="relative">
            <input
              type="text"
              placeholder={t('filterFavorites')}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 border border-slate-800/50 rounded-2xl">
              <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-400">{t('emptyWatchlist')}</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl transition group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.type}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-extrabold text-white truncate flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {item.label}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">{item.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleNavigate(item)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                    title="Open in explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
