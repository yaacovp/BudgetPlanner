"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import type { Transaction } from "@/types/transaction";
import { buildMonthlySeries } from "@/utils/transactions";

interface Props {
  transactions: Transaction[];
}

const COLORS = ["#22c55e", "#ef4444"];

export function EvolutionInOutChart({ transactions }: Props) {
  const data = buildMonthlySeries(transactions);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
          <Area
            type="monotone"
            dataKey="totalEntrees"
            name="Entrées"
            stroke="#22c55e"
            fill="#22c55e33"
          />
          <Area
            type="monotone"
            dataKey="totalDepenses"
            name="Dépenses"
            stroke="#ef4444"
            fill="#ef444433"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BalanceTrendChart({ transactions }: Props) {
  const data = buildMonthlySeries(transactions);

  return (
    <div className="h-72">
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
            name="Solde"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InOutPieChart({ transactions }: Props) {
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "entree") acc.entrees += t.montant;
      else acc.depenses += t.montant;
      return acc;
    },
    { entrees: 0, depenses: 0 }
  );

  const data = [
    { name: "Entrées", value: totals.entrees },
    { name: "Dépenses", value: totals.depenses }
  ];

  return (
    <div className="h-72">
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
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


