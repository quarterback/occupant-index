// Data Adapter for improved-succotash
// This file shows how to adapt improved-succotash's data structure to work with occupant-index's React components

import type { CPIData, HistoricalData, RankingsData } from './cpiData';

/**
 * Adapter to transform improved-succotash's data format to occupant-index's expected format
 * Use this if you want to keep improved-succotash's data structure but make it work with the React frontend
 */

interface ImprovedSuccotashData {
  meta: any;
  compute_cpi: any;
  index_series: {
    launch: any;
    yoy: any;
    qtd: any;
  };
  methodology_variants: {
    general: any;
    frontier_heavy: any;
    budget_heavy: any;
    reasoning_focus: any;
    enterprise: any;
  };
  subindices?: any;
  spreads?: any;
  trend_analysis?: any;
  yield_curve?: any;
  market_data?: any;
  basket_components?: any[];
}

export function adaptImprovedSuccotashData(rawData: ImprovedSuccotashData): CPIData {
  // Map methodology_variants to subindices
  const subindices = {
    frontier: {
      ticker: rawData.methodology_variants.frontier_heavy.ticker,
      name: rawData.methodology_variants.frontier_heavy.name,
      value: rawData.methodology_variants.frontier_heavy.value,
      description: rawData.methodology_variants.frontier_heavy.description,
      mom_change: 0, // Calculate from historical if available
      weight: 25,
    },
    bulk: {
      ticker: rawData.methodology_variants.general.ticker,
      name: rawData.methodology_variants.general.name,
      value: rawData.methodology_variants.general.value,
      description: rawData.methodology_variants.general.description,
      mom_change: 0,
      weight: 35,
    },
    reason: {
      ticker: rawData.methodology_variants.budget_heavy.ticker,
      name: rawData.methodology_variants.budget_heavy.name,
      value: rawData.methodology_variants.budget_heavy.value,
      description: rawData.methodology_variants.budget_heavy.description,
      mom_change: 0,
      weight: 20,
    },
    lctx: {
      ticker: '$LCTX',
      name: 'Long Context CPI',
      value: rawData.methodology_variants.general.value, // Use general as fallback
      description: 'Cost per 1M tokens for extended context windows',
      mom_change: 0,
      weight: 10,
    },
    embedding: {
      ticker: '$EMBED',
      name: 'Embedding CPI',
      value: rawData.methodology_variants.general.value, // Use general as fallback
      description: 'Cost of embedding models',
      mom_change: 0,
      weight: 10,
    },
  };

  // Use existing spreads if available, or create defaults
  const spreads = rawData.spreads || {
    cognition_premium: {
      ticker: '$COGPREM',
      name: 'Cognition Premium',
      value: rawData.methodology_variants.frontier_heavy.value - rawData.methodology_variants.budget_heavy.value,
      unit: 'pts',
      description: 'Cost delta between frontier reasoning models and budget alternatives',
      trend: 'stable',
    },
    judgment_premium: {
      ticker: '$JUDGPREM',
      name: 'Judgment Premium',
      value: rawData.methodology_variants.reasoning_focus.value - rawData.methodology_variants.general.value,
      unit: 'pts',
      description: 'Additional cost for models with reliable judgment vs raw capability',
      trend: 'stable',
    },
    context_premium: {
      ticker: '$CTXPREM',
      name: 'Context Premium',
      value: 0,
      unit: 'pts',
      description: 'Extended context vs standard',
      trend: 'narrowing',
    },
  };

  // Create persona CPIs from methodology variants
  const persona_cpis = {
    startup: {
      ticker: '$START',
      name: 'Startup Persona CPI',
      cpi: rawData.methodology_variants.general.value,
      mom_change: 0,
      description: 'Optimized for prototyping and rapid iteration',
    },
    agentic: {
      ticker: '$AGENT',
      name: 'Agentic Persona CPI',
      cpi: rawData.methodology_variants.frontier_heavy.value,
      mom_change: 0,
      description: 'Autonomous systems requiring reliable judgment',
    },
    throughput: {
      ticker: '$THRU',
      name: 'Throughput Persona CPI',
      cpi: rawData.methodology_variants.budget_heavy.value,
      mom_change: 0,
      description: 'High-volume processing at scale',
    },
  };

  // Adapt basket components if available
  const basket_components = rawData.basket_components || [
    {
      category: 'Frontier Reasoning',
      weight: 25,
      examples: 'o1, Claude Opus, Gemini Ultra',
      avg_cost_per_1m_tokens: rawData.methodology_variants.frontier_heavy.basket_cost * 1000,
    },
    {
      category: 'General Purpose',
      weight: 35,
      examples: 'GPT-4, Claude Sonnet, Gemini Pro',
      avg_cost_per_1m_tokens: rawData.methodology_variants.general.basket_cost * 1000,
    },
    {
      category: 'Budget Inference',
      weight: 20,
      examples: 'GPT-3.5, Claude Haiku, open-source',
      avg_cost_per_1m_tokens: rawData.methodology_variants.budget_heavy.basket_cost * 1000,
    },
    {
      category: 'Embedding & Search',
      weight: 10,
      examples: 'Ada, Voyage, Cohere',
      avg_cost_per_1m_tokens: 0.15,
    },
    {
      category: 'Multimodal',
      weight: 10,
      examples: 'Vision models, audio, video',
      avg_cost_per_1m_tokens: 8.7,
    },
  ];

  return {
    meta: rawData.meta,
    compute_cpi: rawData.compute_cpi,
    subindices,
    spreads,
    persona_cpis,
    basket_components,
    trend_analysis: rawData.trend_analysis,
    yield_curve: rawData.yield_curve,
    exchange_rates: rawData.market_data || {},
  };
}

/**
 * Example usage in cpiData.ts:
 * 
 * export async function fetchCPIData(): Promise<CPIData> {
 *   const response = await fetch('/data/compute-cpi.json');
 *   if (!response.ok) throw new Error('Failed to fetch CPI data');
 *   const rawData = await response.json();
 *   return adaptImprovedSuccotashData(rawData);
 * }
 */
