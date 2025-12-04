"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";
import type { Transaction } from "@/types/transaction";
import { buildMonthlySeries } from "@/utils/transactions";

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


