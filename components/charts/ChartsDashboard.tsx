"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import type { Transaction } from "@/types/transaction";
import type { Compte } from "@/types/compte";
import { buildMonthlySeries } from "@/utils/transactions";
import { calculateAllSoldes } from "@/utils/comptes";

interface ChartsProps {
  transactions: Transaction[];
}

export function BalanceLineChart({ transactions }: ChartsProps) {
  const data = buildMonthlySeries(transactions);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1e293b",
              fontSize: 11
            }}
          />
          <Line
            type="monotone"
            dataKey="solde"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InOutBarChart({ transactions }: ChartsProps) {
  const data = buildMonthlySeries(transactions);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1e293b",
              fontSize: 11
            }}
          />
          <Legend />
          <Bar dataKey="totalEntrees" name="Entrées" fill="#22c55e" />
          <Bar dataKey="totalDepenses" name="Dépenses" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const ACCOUNT_COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ec4899", "#8b5cf6"];

interface CompteChartProps {
  comptes: Compte[];
  transactions: Transaction[];
}

export function ComptePieChart({ comptes, transactions }: CompteChartProps) {
  const soldes = calculateAllSoldes(comptes, transactions).filter(
    (s) => s.solde !== 0
  );

  if (soldes.length === 0) {
    return (
      <p className="text-xs text-slate-400">
        Aucun solde de compte à afficher pour le moment.
      </p>
    );
  }

  const data = soldes.map((s) => ({
    name: `${s.compte.intitule} – ${s.compte.nom_banque}`,
    value: s.solde
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1e293b",
              fontSize: 11
            }}
          />
          <Legend />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={ACCOUNT_COLORS[index % ACCOUNT_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


