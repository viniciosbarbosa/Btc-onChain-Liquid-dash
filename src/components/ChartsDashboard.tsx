import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Cpu, Layers, ShieldCheck, Droplet, BarChart3, TrendingUp, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export type TimeFrame = '24h' | '7d' | '30d' | '1y';

// Data sets for timeframes
const hashrateDataSets: Record<TimeFrame, Array<{ date: string; hashrate: number; diff: number }>> = {
  '24h': [
    { date: '00:00', hashrate: 695, diff: 92.4 },
    { date: '04:00', hashrate: 702, diff: 92.4 },
    { date: '08:00', hashrate: 710, diff: 92.4 },
    { date: '12:00', hashrate: 708, diff: 92.4 },
    { date: '16:00', hashrate: 715, diff: 92.4 },
    { date: '20:00', hashrate: 722, diff: 92.4 },
  ],
  '7d': [
    { date: 'Seg', hashrate: 670, diff: 89.2 },
    { date: 'Ter', hashrate: 682, diff: 89.2 },
    { date: 'Qua', hashrate: 690, diff: 89.2 },
    { date: 'Qui', hashrate: 685, diff: 92.4 },
    { date: 'Sex', hashrate: 705, diff: 92.4 },
    { date: 'Sáb', hashrate: 712, diff: 92.4 },
    { date: 'Dom', hashrate: 722, diff: 92.4 },
  ],
  '30d': [
    { date: '01 Set', hashrate: 620, diff: 84.5 },
    { date: '06 Set', hashrate: 642, diff: 86.1 },
    { date: '12 Set', hashrate: 658, diff: 86.1 },
    { date: '18 Set', hashrate: 672, diff: 89.2 },
    { date: '24 Set', hashrate: 690, diff: 92.4 },
    { date: '30 Set', hashrate: 710, diff: 92.4 },
    { date: '02 Out', hashrate: 722, diff: 92.4 },
  ],
  '1y': [
    { date: 'Out 25', hashrate: 450, diff: 62.1 },
    { date: 'Dez 25', hashrate: 490, diff: 67.3 },
    { date: 'Fev 26', hashrate: 540, diff: 75.4 },
    { date: 'Abr 26', hashrate: 610, diff: 81.2 },
    { date: 'Jun 26', hashrate: 650, diff: 86.5 },
    { date: 'Ago 26', hashrate: 685, diff: 89.2 },
    { date: 'Out 26', hashrate: 722, diff: 92.4 },
  ]
};

const priceVolumeDataSets: Record<TimeFrame, Array<{ date: string; price: number; volumeBtc: number }>> = {
  '24h': [
    { date: '00:00', price: 64200, volumeBtc: 4200 },
    { date: '06:00', price: 64550, volumeBtc: 5800 },
    { date: '12:00', price: 65100, volumeBtc: 8900 },
    { date: '18:00', price: 65800, volumeBtc: 7100 },
    { date: '24:00', price: 66340, volumeBtc: 6300 },
  ],
  '7d': [
    { date: 'Seg', price: 62800, volumeBtc: 24000 },
    { date: 'Ter', price: 63400, volumeBtc: 28500 },
    { date: 'Qua', price: 64100, volumeBtc: 31000 },
    { date: 'Qui', price: 64900, volumeBtc: 29500 },
    { date: 'Sex', price: 65600, volumeBtc: 38000 },
    { date: 'Sáb', price: 66100, volumeBtc: 21000 },
    { date: 'Dom', price: 66340, volumeBtc: 19500 },
  ],
  '30d': [
    { date: '01 Set', price: 58400, volumeBtc: 110000 },
    { date: '08 Set', price: 60200, volumeBtc: 125000 },
    { date: '15 Set', price: 62100, volumeBtc: 140000 },
    { date: '22 Set', price: 63800, volumeBtc: 135000 },
    { date: '29 Set', price: 65400, volumeBtc: 152000 },
    { date: '02 Out', price: 66340, volumeBtc: 160000 },
  ],
  '1y': [
    { date: 'Out 25', price: 34000, volumeBtc: 1400000 },
    { date: 'Jan 26', price: 42500, volumeBtc: 1850000 },
    { date: 'Abr 26', price: 51200, volumeBtc: 1620000 },
    { date: 'Jul 26', price: 61800, volumeBtc: 1950000 },
    { date: 'Out 26', price: 66340, volumeBtc: 2100000 },
  ]
};

const outputTypeData = [
  { name: 'Native SegWit (bech32)', value: 48, color: '#F59E0B' },
  { name: 'Taproot (p2tr)', value: 26, color: '#10B981' },
  { name: 'Nested SegWit (p2sh)', value: 16, color: '#06B6D4' },
  { name: 'Legacy (p2pkh)', value: 10, color: '#EF4444' },
];

export function ChartsDashboard(): JSX.Element {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<TimeFrame>('30d');

  const currentHashrateData = hashrateDataSets[timeframe];
  const currentPriceData = priceVolumeDataSets[timeframe];

  const latestHashrate = currentHashrateData[currentHashrateData.length - 1].hashrate;
  const prevHashrate = currentHashrateData[0].hashrate;
  const hashrateChange = (((latestHashrate - prevHashrate) / prevHashrate) * 100).toFixed(1);

  const latestPrice = currentPriceData[currentPriceData.length - 1].price;
  const prevPrice = currentPriceData[0].price;
  const priceChange = (((latestPrice - prevPrice) / prevPrice) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filter Controls */}
      <div className="card-glass-btc flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="heading-dashboard text-base">
              {t('chartsDashboardTitle')}
            </h3>
            <p className="subtitle-dashboard">
              {t('chartsDashboardSubtitle')}
            </p>
          </div>
        </div>

        {/* Timeframe Filters */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
          {(['24h', '7d', '30d', '1y'] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`btn-pill-filter ${
                timeframe === tf
                  ? 'bg-amber-500 text-black shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quick KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-stat">
          <span className="label-stat">
            <Cpu className="w-3.5 h-3.5 text-amber-400" /> {t('estimatedHashrate')}
          </span>
          <div className="value-stat">
            {latestHashrate} <span className="text-xs font-normal text-slate-400">EH/s</span>
          </div>
          <div className={`text-xs font-mono mt-1 font-bold flex items-center gap-1 ${
            parseFloat(hashrateChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {parseFloat(hashrateChange) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {hashrateChange}% ({timeframe})
          </div>
        </div>

        <div className="card-stat">
          <span className="label-stat">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {t('btcPrice')}
          </span>
          <div className="text-xl font-extrabold font-mono text-emerald-400 mt-1">
            ${latestPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className={`text-xs font-mono mt-1 font-bold flex items-center gap-1 ${
            parseFloat(priceChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {parseFloat(priceChange) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {priceChange}% ({timeframe})
          </div>
        </div>

        <div className="card-stat">
          <span className="label-stat">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> SegWit/Taproot
          </span>
          <div className="text-xl font-extrabold font-mono text-cyan-400 mt-1">
            74% <span className="text-xs font-normal text-slate-400">on-chain</span>
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">Taproot: 26% | SegWit: 48%</div>
        </div>

        <div className="card-stat">
          <span className="label-stat">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> {t('recommendedFees')}
          </span>
          <div className="text-xl font-extrabold font-mono text-amber-400 mt-1">
            18 <span className="text-xs font-normal text-slate-400">sat/vB</span>
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">{t('nextBlock')}</div>
        </div>
      </div>

      {/* Grid 1: Hashrate & Price Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Hashrate (EH/s) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('hashrateTitle')}</h4>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              {timeframe.toUpperCase()}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentHashrateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(val: number) => [`${val} EH/s`, 'Hashrate']}
                />
                <Area type="monotone" dataKey="hashrate" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#hashGrad)" name="Hashrate (EH/s)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bitcoin Price & Volume */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('btcPriceVolumeTitle')}</h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              USD & BTC
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentPriceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={['dataMin - 500', 'dataMax + 500']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#FFFFFF' }}
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(val: number) => [`$${val.toLocaleString()} USD`, 'Preço BTC']}
                />
                <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} name="Preço (USD)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Address Adoption & SegWit Types */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-extrabold text-white uppercase">{t('addressTypeDistTitle')}</h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">{t('mempoolConsensus')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outputTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {outputTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  labelStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value}%`, 'Proporção']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {outputTypeData.map((item, idx) => (
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
