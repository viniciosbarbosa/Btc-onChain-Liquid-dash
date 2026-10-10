import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Droplet, Lock, Layers, Activity, TrendingUp } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const liquidPegData = [
  { day: 'Seg', pegin: 45.2, pegout: 28.1 },
  { day: 'Ter', pegin: 62.8, pegout: 35.4 },
  { day: 'Qua', pegin: 89.1, pegout: 42.0 },
  { day: 'Qui', pegin: 73.5, pegout: 50.2 },
  { day: 'Sex', pegin: 110.4, pegout: 65.8 },
  { day: 'Sáb', pegin: 54.0, pegout: 30.1 },
  { day: 'Dom', pegin: 68.3, pegout: 24.5 },
];

const confidentialTxData = [
  { time: '00:00', ratio: 92.4 },
  { time: '04:00', ratio: 94.1 },
  { time: '08:00', ratio: 95.8 },
  { time: '12:00', ratio: 93.9 },
  { time: '16:00', ratio: 96.2 },
  { time: '20:00', ratio: 94.8 },
];

const liquidAssetShare = [
  { name: 'Liquid Bitcoin (L-BTC)', value: 68, color: '#06B6D4' },
  { name: 'Tether USDt (Liquid)', value: 24, color: '#10B981' },
  { name: 'Blockstream Mining Note (BMN)', value: 5, color: '#F59E0B' },
  { name: 'Outros Tokens Emitidos', value: 3, color: '#A855F7' },
];

export function LiquidCharts(): JSX.Element {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="card-glass-liquid flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="heading-dashboard text-base">
              {t('liquidChartsTitle')}
            </h3>
            <p className="subtitle-dashboard text-cyan-200/70">
              {t('liquidChartsSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
          <button
            onClick={() => setTimeframe('7d')}
            className={`btn-pill-filter ${
              timeframe === '7d' ? 'bg-cyan-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('days7')}
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`btn-pill-filter ${
              timeframe === '30d' ? 'bg-cyan-500 text-black shadow font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('days30')}
          </button>
        </div>
      </div>

      {/* Grid 1: Peg-In/Out Chart & Confidential Ratio Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peg-In / Peg-Out Flow */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('pegInOutTitle')}</h4>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">{t('federationNodesLabel')}</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liquidPegData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(val: number) => [`${val} BTC`, 'Volume']}
                />
                <Bar dataKey="pegin" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Peg-In (BTC -> L-BTC)" />
                <Bar dataKey="pegout" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Peg-Out (L-BTC -> BTC)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidential Transactions Ratio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('confidentialRatioTitle')}</h4>
            </div>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
              94.8%
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={confidentialTxData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(val: number) => [`${val}%`, t('confidentialRatioTitle')]}
                />
                <Area type="monotone" dataKey="ratio" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#purpleGrad)" name={t('confidentialRatioTitle')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Liquid Asset Share Pie */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('liquidAssetShareTitle')}</h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Sidechain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={liquidAssetShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {liquidAssetShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value}%`, 'Market Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {liquidAssetShare.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white font-bold">{item.name}</span>
                </div>
                <span className="font-extrabold" style={{ color: item.color }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
