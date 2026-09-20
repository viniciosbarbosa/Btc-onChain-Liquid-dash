import React, { useState } from 'react';
import { formatSatsToBTC, truncateHash } from '../utils/formatters';
import { NetworkType } from '../types';
import { ArrowRight, GitCommit, Layers, Flame, ShieldAlert, CheckCircle2, Clock, Sparkles, CornerDownRight, ArrowDownRight } from 'lucide-react';

interface TxNode {
  id: string;
  txid: string;
  type: 'ancestor' | 'current' | 'descendant';
  depth: number; // e.g. -2, -1, 0, 1, 2
  status: 'mempool' | 'confirmed';
  feeRate: number; // sat/vB
  feeSat: number;
  vsize: number;
  valueSat: number;
  label: string;
  inputsCount: number;
  outputsCount: number;
}

interface PendingTxTracerProps {
  initialTxid: string;
  networkType?: NetworkType;
  onSelectTx?: (txid: string) => void;
}

export function PendingTxTracer({ initialTxid, networkType = 'btc', onSelectTx }: PendingTxTracerProps): JSX.Element {
  const [activeTxid, setActiveTxid] = useState<string>(initialTxid);

  // Generate dynamic ancestor and descendant node graph for activeTxid
  const generateTraceNodes = (currentId: string): TxNode[] => {
    const isLiquid = networkType === 'liquid' || currentId.startsWith('liq_');
    const baseHash = currentId.substring(0, 8);

    return [
      {
        id: `anc-2`,
        txid: `e9a2${baseHash}89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda1111`,
        type: 'ancestor',
        depth: -2,
        status: 'confirmed',
        feeRate: 18.5,
        feeSat: 2627,
        vsize: 142,
        valueSat: 45000000,
        label: 'Transação Avó (Confirmada)',
        inputsCount: 1,
        outputsCount: 2
      },
      {
        id: `anc-1`,
        txid: `b84f${baseHash}4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda2222`,
        type: 'ancestor',
        depth: -1,
        status: 'mempool',
        feeRate: 12.0,
        feeSat: 1704,
        vsize: 142,
        valueSat: 28000000,
        label: '1. Transação Pai (Pendente na Mempool)',
        inputsCount: 2,
        outputsCount: 2
      },
      {
        id: `current`,
        txid: currentId,
        type: 'current',
        depth: 0,
        status: 'mempool',
        feeRate: 34.5,
        feeSat: 4899,
        vsize: 142,
        valueSat: 18500000,
        label: '2. Transação Selecionada (CPFP / Atual)',
        inputsCount: 1,
        outputsCount: 2
      },
      {
        id: `desc-1`,
        txid: `c3d2${baseHash}1c3d710a9f57d0c02928416460c4b722ae3457a11eec381c526d3333`,
        type: 'descendant',
        depth: 1,
        status: 'mempool',
        feeRate: 48.0,
        feeSat: 6816,
        vsize: 142,
        valueSat: 12000000,
        label: '3. Transação Filho (CPFP Accelerating Child)',
        inputsCount: 1,
        outputsCount: 2
      },
      {
        id: `desc-2`,
        txid: `f7e6${baseHash}83c78bb71a632313ba3760f1763d9cfcffae02258fea9806a58fbd4444`,
        type: 'descendant',
        depth: 2,
        status: 'mempool',
        feeRate: 52.5,
        feeSat: 7455,
        vsize: 142,
        valueSat: 8400000,
        label: '4. Transação Neto (Consolidação de Output)',
        inputsCount: 2,
        outputsCount: 1
      }
    ];
  };

  const [nodes, setNodes] = useState<TxNode[]>(() => generateTraceNodes(initialTxid));

  const handleNodeClick = (node: TxNode) => {
    setActiveTxid(node.txid);
    setNodes(generateTraceNodes(node.txid));
    if (onSelectTx) onSelectTx(node.txid);
  };

  const currentNode = nodes.find(n => n.type === 'current') || nodes[2];
  const parentNode = nodes.find(n => n.depth === -1);
  const childNode = nodes.find(n => n.depth === 1);

  // Package Effective Fee Rate (CPFP calculation: combined sat/vB)
  const totalPackageFee = (parentNode?.feeSat || 0) + (currentNode?.feeSat || 0) + (childNode?.feeSat || 0);
  const totalPackageVsize = (parentNode?.vsize || 0) + (currentNode?.vsize || 0) + (childNode?.vsize || 0);
  const effectivePackageFeeRate = (totalPackageFee / (totalPackageVsize || 1)).toFixed(1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <GitCommit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              Rastro de Dependências de Transação (Mempool Trace Graph) <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Siga a sequência 1 &rarr; 2 &rarr; 3 &rarr; 4 de transações encadeadas (Ancestrais & Descendentes CPFP)
            </p>
          </div>
        </div>

        {/* Effective Package Fee Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Pacote CPFP Efetivo:</span>
          <span className="text-amber-400 font-extrabold text-sm">{effectivePackageFeeRate} sat/vB</span>
        </div>
      </div>

      {/* VISUAL DEPENDENCY TREE / PIPELINE FLOW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
          <span>Sequência Encadeada de Transações (Clique em qualquer nó para avançar o rastro)</span>
          <span className="text-amber-400">Ordem de Dependência: Antecessores &rarr; Sucessores</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {nodes.map((node, idx) => {
            const isSelected = node.txid === activeTxid || node.type === 'current';
            return (
              <div key={node.id} className="relative flex flex-col">
                <button
                  onClick={() => handleNodeClick(node)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between h-full relative overflow-hidden group ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.03]'
                      : node.status === 'confirmed'
                      ? 'bg-slate-950/70 border-emerald-500/30 hover:border-emerald-500/60'
                      : 'bg-slate-950/90 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                      isSelected
                        ? 'bg-amber-500 text-black'
                        : node.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      Passo #{idx + 1}
                    </span>

                    {node.status === 'confirmed' ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Bloco
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" /> Mempool
                      </span>
                    )}
                  </div>

                  {/* Label & TxID */}
                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-slate-300 line-clamp-1 mb-1 font-sans">
                      {node.label}
                    </div>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-amber-400 transition truncate">
                      {truncateHash(node.txid, 8)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span>Taxa:</span>
                      <span className="text-amber-400 font-bold">{node.feeRate} sat/vB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span className="text-white font-bold">{formatSatsToBTC(node.valueSat)} BTC</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>In/Out:</span>
                      <span>{node.inputsCount} in / {node.outputsCount} out</span>
                    </div>
                  </div>
                </button>

                {/* Arrow Connector for Next Node */}
                {idx < nodes.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-1 bg-slate-900 border border-slate-700 text-amber-400 rounded-full shadow">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED TRANSACTION TRACE SUMMARY CARD */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-300 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-amber-400 font-bold border-b border-slate-800 pb-2">
          <span className="flex items-center gap-2">
            <CornerDownRight className="w-4 h-4" /> Detalhes do Rastro Selecionado: {activeTxid}
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Antecessores Requeridos: <strong className="text-white">2 Transações</strong> (~284 vB)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 font-mono">
            <span className="text-slate-400 text-[11px]">Pacote Ancestral (Ancestors)</span>
            <div className="text-sm font-bold text-white">2 Transações Pendentes</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Esta transação não pode ser minerada antes que seus 2 antecessores entrem num bloco.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 font-mono">
            <span className="text-slate-400 text-[11px]">Pacote Sucessor (Descendants CPFP)</span>
            <div className="text-sm font-bold text-emerald-400">2 Transações Filhas</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Transações posteriores oferecendo taxa extra (48.0 e 52.5 sat/vB) para acelerar a mineração.
            </p>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 font-mono">
            <span className="text-slate-400 text-[11px]">Taxa Efetiva do Pacote Completo</span>
            <div className="text-sm font-bold text-amber-400">{effectivePackageFeeRate} sat/vB</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Taxa considerada pelos mineradores para ordenar o grupo inteiro no próximo bloco.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
