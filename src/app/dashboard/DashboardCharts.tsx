"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#E1343A", "#1D4ED8", "#16A34A", "#D97706", "#7C3AED", "#0891B2", "#BE185D", "#15803D", "#EA580C", "#4338CA"];
const RED = "#E1343A";

type Response = Record<string, unknown>;
type ChartItem = { name: string; value: number; pct: number };

function count(data: Response[], field: string, total: number): ChartItem[] {
  const map: Record<string, number> = {};
  for (const r of data) {
    const val = r[field] as string;
    if (val) map[val] = (map[val] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, pct: total ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
}

function countMulti(data: Response[], field: string, total: number): ChartItem[] {
  const map: Record<string, number> = {};
  for (const r of data) {
    const arr = r[field] as string[] ?? [];
    for (const val of arr) map[val] = (map[val] ?? 0) + 1;
  }
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, pct: total ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct);
}

function PieCard({ title, data }: { title: string; data: ChartItem[] }) {
  if (!data.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={85}
            dataKey="pct"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
              cx?: number; cy?: number; midAngle?: number;
              innerRadius?: number; outerRadius?: number; percent?: number;
            }) => {
              if (!percent || percent < 0.05) return null;
              const RADIAN = Math.PI / 180;
              const r = (innerRadius ?? 0) + ((outerRadius ?? 0) - (innerRadius ?? 0)) * 0.55;
              const x = (cx ?? 0) + r * Math.cos(-(midAngle ?? 0) * RADIAN);
              const y = (cy ?? 0) + r * Math.sin(-(midAngle ?? 0) * RADIAN);
              return (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => [`${v}%`]} />
          <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Barras horizontais — múltipla escolha em números absolutos
function BarCard({ title, data }: { title: string; data: ChartItem[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">{title}</h3>
      <ResponsiveContainer width="100%" height={data.length * 48 + 20}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, max + 1]} allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v} respostas`]} />
          <Bar dataKey="value" fill={RED} radius={[0, 4, 4, 0]}
            label={{ position: "right", fontSize: 11, formatter: (v: unknown) => `${v}` }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScaleCard({ title, data, total }: { title: string; data: ChartItem[]; total: number }) {
  if (!data.length) return null;
  const avg = total
    ? (data.reduce((s, d) => s + Number(d.name) * d.value, 0) / total).toFixed(1)
    : "—";

  const scaleData = ["1", "2", "3", "4", "5"].map(n => ({
    name: n,
    pct: data.find(d => d.name === n)?.pct ?? 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">{title}</h3>
      <p className="text-3xl font-bold text-[#E1343A] mb-4">{avg} <span className="text-sm text-gray-400 font-normal">/ 5</span></p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={scaleData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [`${v}%`]} />
          <Bar dataKey="pct" fill={RED} radius={[4, 4, 0, 0]}
            label={{ position: "top", fontSize: 11, formatter: (v: unknown) => Number(v) ? `${v}%` : "" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-2xl font-bold text-[#E1343A]">{value}</p>
    </div>
  );
}

export default function DashboardCharts({ data }: { data: Response[] }) {
  const total = data.length;
  if (total === 0) return <p className="text-center text-gray-400">Nenhuma resposta ainda.</p>;

  const simMin = count(data, "q11", total).find(d => d.name === "Sim")?.pct ?? 0;
  const avgRel = (() => {
    const vals = data.map(r => Number(r["q20"])).filter(Boolean);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  })();

  return (
    <div className="flex flex-col gap-6">

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de respostas" value={total} />
        <StatCard label="Pensaram em parar" value={`${simMin}%`} />
        <StatCard label="Relacionamento Seminário–Igreja" value={`${avgRel}/5`} />
        <StatCard label="Coletadas hoje" value={
          data.filter(r => new Date(r["created_at"] as string).toDateString() === new Date().toDateString()).length
        } />
      </div>

      {/* Bloco 1 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 1 — Perfil Pessoal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Faixa etária" data={count(data, "q1", total)} />
        <PieCard title="Gênero" data={count(data, "q2", total)} />
        <PieCard title="Denominação" data={count(data, "q3", total)} />
        <PieCard title="Participa de ministério" data={count(data, "q4", total)} />
        <PieCard title="Possui curso superior em outra área" data={count(data, "q5", total)} />
      </div>

      {/* Bloco 2 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 2 — Trajetória no Seminário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Tempo de estudo" data={count(data, "q6", total)} />
        <PieCard title="Como conheceu o seminário" data={count(data, "q7", total)} />
        <PieCard title="Quem mais incentivou" data={count(data, "q8", total)} />
        <PieCard title="Rotina" data={count(data, "q9", total)} />
      </div>

      {/* Bloco 3 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 3 — Motivação e Vocação</h2>
      <BarCard title="Principal motivo para estudar (múltipla escolha — % dos respondentes)" data={countMulti(data, "q10", total)} />

      {/* Bloco 4 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 4 — Continuidade e Dificuldades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Pensou em parar os estudos" data={count(data, "q11", total)} />
        <BarCard title="Motivos para parar (múltipla escolha — % dos respondentes)" data={countMulti(data, "q12", total)} />
      </div>

      {/* Bloco 5 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 5 — Igreja Local e o Seminário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Suporte da igreja" data={count(data, "q13", total)} />
        <PieCard title="Conhece alguém que gostaria estudar" data={count(data, "q14", total)} />
        <BarCard title="Motivos comuns para não estudar (múltipla escolha — % dos respondentes)" data={countMulti(data, "q15", total)} />
      </div>

      {/* Bloco 6 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 6 — Conteúdo e Experiência</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Conteúdo aplicável na vida ministerial" data={count(data, "q17", total)} />
        <ScaleCard title="Relacionamento SETEBAN ↔ Igrejas" data={count(data, "q20", total)} total={total} />
      </div>

      {/* Bloco 7 */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bloco 7 — Missão e Plantio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieCard title="Igreja plantou congregação" data={count(data, "q21", total)} />
        <PieCard title="Interesse em plantio de igreja" data={count(data, "q22", total)} />
        <PieCard title="Preparado para missões urbanas na RMG" data={count(data, "q23", total)} />
      </div>

    </div>
  );
}
