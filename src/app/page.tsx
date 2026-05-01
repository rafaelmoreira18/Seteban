"use client";
import { useState } from "react";

// ——— Types ———
type FormData = {
  q1: string; q2: string; q3: string; q4: string; q5: string;
  q6: string; q7: string; q8: string; q9: string;
  q10: string[];
  q11: string; q12: string[];
  q13: string; q14: string; q15: string[];
  q17: string; q20: string;
  q21: string; q22: string; q23: string;
  q26: string;
};

const INITIAL: FormData = {
  q1: "", q2: "", q3: "", q4: "", q5: "",
  q6: "", q7: "", q8: "", q9: "",
  q10: [],
  q11: "", q12: [],
  q13: "", q14: "", q15: [],
  q17: "", q20: "",
  q21: "", q22: "", q23: "",
  q26: "",
};

// ——— UI primitives ———

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b-2 border-[#fde8e9]">
      <div className="w-3 h-7 rounded-full bg-[#E1343A] shrink-0" />
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function QLabel({ n, text, multi }: { n: number; text: string; multi?: boolean }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-gray-800 leading-snug">
        <span className="text-[#E1343A] font-bold">{n}.</span> {text}
      </p>
      {multi && (
        <p className="text-xs text-gray-400 mt-0.5">Pode marcar mais de uma opção</p>
      )}
    </div>
  );
}

function Option({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 active:scale-[0.98]",
        selected
          ? "bg-[#E1343A] border-[#E1343A] text-white font-semibold"
          : "bg-white border-gray-200 text-gray-700",
      ].join(" ")}
    >
      {selected && <span className="mr-2 font-bold">✓</span>}
      {label}
    </button>
  );
}

function MultiOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 active:scale-[0.98] flex items-center gap-3",
        selected
          ? "border-[#E1343A] text-gray-800 font-semibold"
          : "bg-white border-gray-200 text-gray-700",
      ].join(" ")}
      style={selected ? { backgroundColor: "rgba(225,52,58,0.07)" } : undefined}
    >
      <span
        className={[
          "w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center text-xs font-bold",
          selected ? "bg-[#E1343A] border-[#E1343A] text-white" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {selected && "✓"}
      </span>
      {label}
    </button>
  );
}

function ScaleInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex gap-2">
        {["1", "2", "3", "4", "5"].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? "" : n)}
            className={[
              "flex-1 py-3 rounded-xl border-2 font-bold text-base transition-all duration-150 active:scale-[0.96]",
              value === n
                ? "bg-[#E1343A] border-[#E1343A] text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-700",
            ].join(" ")}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-xs text-gray-400">Muito distante</span>
        <span className="text-xs text-gray-400">Muito próximo</span>
      </div>
    </div>
  );
}

// ——— Main page ———
export default function SetebanForm() {
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof FormData) {
    return (value: string) => setData((d) => ({ ...d, [field]: value }));
  }

  function toggle(field: "q10" | "q12" | "q15") {
    return (value: string) =>
      setData((d) => {
        const arr = d[field] as string[];
        return {
          ...d,
          [field]: arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value],
        };
      });
  }

  function pick(field: keyof FormData, current: string, next: string) {
    set(field)(current === next ? "" : next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#E1343A] flex items-center justify-center shadow-lg">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Enviado!</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Obrigado por responder o questionário.
              <br />
              Suas respostas foram registradas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-block w-10 h-1.5 rounded-full bg-[#E1343A] mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SETEBAN</h1>
          <p className="text-xs text-gray-500 mt-1">Questionário · Perfil do Aluno · Goiânia</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="h-1.5 bg-[#E1343A]" />

          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-8">
            <p className="text-xs text-gray-400 leading-relaxed">
              Suas respostas são anônimas e contribuirão para melhorar a formação teológica
              e o relacionamento entre o Seminário e as igrejas da RMG.
            </p>

            {/* ── BLOCO 1 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 1 — Perfil Pessoal" />

              <div>
                <QLabel n={1} text="Idade" />
                <div className="flex flex-col gap-2">
                  {["18–25", "26–35", "36–45", "46–55", "56 ou mais"].map((o) => (
                    <Option key={o} label={o} selected={data.q1 === o} onClick={() => pick("q1", data.q1, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={2} text="Gênero" />
                <div className="flex flex-col gap-2">
                  {["Masculino", "Feminino"].map((o) => (
                    <Option key={o} label={o} selected={data.q2 === o} onClick={() => pick("q2", data.q2, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={3} text="Você é membro de qual vertente/denominação?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Igreja Batista Nacional (CBN-GO)",
                    "Outra vertente batista",
                    "Outra denominação",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q3 === o} onClick={() => pick("q3", data.q3, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={4} text="Você faz parte de algum ministério na sua igreja?" />
                <div className="flex flex-col gap-2">
                  {["Sim", "Não"].map((o) => (
                    <Option key={o} label={o} selected={data.q4 === o} onClick={() => pick("q4", data.q4, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={5} text="Você possui curso superior em outra área além da teologia?" />
                <div className="flex flex-col gap-2">
                  {["Sim", "Não"].map((o) => (
                    <Option key={o} label={o} selected={data.q5 === o} onClick={() => pick("q5", data.q5, o)} />
                  ))}
                </div>
              </div>
            </section>

            {/* ── BLOCO 2 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 2 — Trajetória no Seminário" />

              <div>
                <QLabel n={6} text="Há quanto tempo você estuda no SETEBAN?" />
                <div className="flex flex-col gap-2">
                  {["Menos de 1 ano", "1–2 anos", "Mais de 2 anos"].map((o) => (
                    <Option key={o} label={o} selected={data.q6 === o} onClick={() => pick("q6", data.q6, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={7} text="Como você conheceu o Seminário?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Indicação do pastor",
                    "Indicação de amigo ou familiar",
                    "A própria igreja me enviou",
                    "Busca própria",
                    "Redes sociais ou internet",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q7 === o} onClick={() => pick("q7", data.q7, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={8} text="Quem mais incentivou sua entrada no Seminário?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Meu pastor",
                    "Minha família",
                    "Um amigo",
                    "Decisão própria sem influência externa",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q8 === o} onClick={() => pick("q8", data.q8, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={9} text="Como você descreve sua rotina em relação ao Seminário?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Me dedico exclusivamente ao Seminário",
                    "Trabalho ou estudo em outra área fora do Seminário",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q9 === o} onClick={() => pick("q9", data.q9, o)} />
                  ))}
                </div>
              </div>
            </section>

            {/* ── BLOCO 3 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 3 — Motivação e Vocação" />

              <div>
                <QLabel n={10} text="Qual é o seu principal motivo para estudar no Seminário?" multi />
                <div className="flex flex-col gap-2">
                  {[
                    "Me tornar pastor",
                    "Liderar um ministério na minha igreja",
                    "Atuar como mestre/professor bíblico",
                    "Fazer missões (nacionais ou internacionais)",
                    "Servir em ações sociais e comunitárias",
                    "Aprofundamento pessoal na fé e nas Escrituras",
                    "Plantar uma nova igreja",
                    "Desenvolver um ministério de discipulado",
                  ].map((o) => (
                    <MultiOption key={o} label={o} selected={data.q10.includes(o)} onClick={() => toggle("q10")(o)} />
                  ))}
                </div>
              </div>
            </section>

            {/* ── BLOCO 4 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 4 — Continuidade e Dificuldades" />

              <div>
                <QLabel n={11} text="Você já parou ou pensou em parar os estudos no Seminário?" />
                <div className="flex flex-col gap-2">
                  {["Sim", "Não"].map((o) => (
                    <Option key={o} label={o} selected={data.q11 === o} onClick={() => pick("q11", data.q11, o)} />
                  ))}
                </div>
              </div>

              {data.q11 === "Sim" && (
                <div>
                  <QLabel n={12} text="Quais foram os motivos?" multi />
                  <div className="flex flex-col gap-2">
                    {[
                      "Dificuldade financeira",
                      "Falta de tempo (trabalho, família, deslocamento)",
                      "Falta de apoio ou incentivo da igreja local",
                      "Desmotivação com o conteúdo",
                      "Dificuldade acadêmica",
                      "Problemas de saúde pessoal ou familiar",
                      "Distância geográfica",
                    ].map((o) => (
                      <MultiOption key={o} label={o} selected={data.q12.includes(o)} onClick={() => toggle("q12")(o)} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── BLOCO 5 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 5 — Igreja Local e o Seminário" />

              <div>
                <QLabel n={13} text="Como você avalia o suporte da sua igreja em relação aos seus estudos?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Minha igreja me incentiva ativamente e oferece suporte",
                    "Minha igreja me apoia moralmente, mas sem recursos práticos",
                    "Sinto falta de incentivo pastoral e/ou de recursos",
                    "Minha igreja desconhece minha formação",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q13 === o} onClick={() => pick("q13", data.q13, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={14} text="Você conhece alguém na sua igreja que gostaria estudar no Seminário, mas não estuda?" />
                <div className="flex flex-col gap-2">
                  {["Sim", "Não"].map((o) => (
                    <Option key={o} label={o} selected={data.q14 === o} onClick={() => pick("q14", data.q14, o)} />
                  ))}
                </div>
              </div>

              {data.q14 === "Sim" && (
                <div>
                  <QLabel n={15} text="Quais os motivos mais comuns?" multi />
                  <div className="flex flex-col gap-2">
                    {[
                      "Falta de recursos financeiros",
                      "Tempo insuficiente",
                      "Dificuldade de compreender o conteúdo",
                      "Falta de apoio ou incentivo da igreja local",
                      "Desconhecimento sobre o Seminário",
                      "Distância geográfica",
                    ].map((o) => (
                      <MultiOption key={o} label={o} selected={data.q15.includes(o)} onClick={() => toggle("q15")(o)} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── BLOCO 6 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 6 — Conteúdo e Experiência" />

              <div>
                <QLabel n={17} text="O conteúdo ensinado tem sido aplicável na sua vida ministerial?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Sim, consigo aplicar com facilidade",
                    "Parcialmente, em algumas disciplinas",
                    "Tenho dificuldade de conectar o conteúdo com a prática",
                    "Ainda não atuo em ministério",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q17 === o} onClick={() => pick("q17", data.q17, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={20} text="Como você avalia o relacionamento entre o SETEBAN e as igrejas?" />
                <ScaleInput value={data.q20} onChange={set("q20")} />
              </div>
            </section>

            {/* ── BLOCO 7 ── */}
            <section className="flex flex-col gap-5">
              <SectionHeader title="Bloco 7 — Missão e Plantio" />

              <div>
                <QLabel n={21} text="Sua igreja já plantou alguma congregação ou igreja filha?" />
                <div className="flex flex-col gap-2">
                  {["Sim", "Não", "Não sei"].map((o) => (
                    <Option key={o} label={o} selected={data.q21 === o} onClick={() => pick("q21", data.q21, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel n={22} text="Você tem interesse em participar de um projeto de plantio de igreja?" />
                <div className="flex flex-col gap-2">
                  {[
                    "Sim, tenho muito interesse",
                    "Talvez no futuro",
                    "Não tenho interesse",
                    "Já participo de um",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q22 === o} onClick={() => pick("q22", data.q22, o)} />
                  ))}
                </div>
              </div>

              <div>
                <QLabel
                  n={23}
                  text="Você se sente preparado(a) para atuar em missões urbanas na Região Metropolitana de Goiás?"
                />
                <div className="flex flex-col gap-2">
                  {[
                    "Sim, me sinto preparado(a)",
                    "Parcialmente preparado(a)",
                    "Ainda não me sinto preparado(a)",
                    "Nunca pensei nisso",
                  ].map((o) => (
                    <Option key={o} label={o} selected={data.q23 === o} onClick={() => pick("q23", data.q23, o)} />
                  ))}
                </div>
              </div>
            </section>

            {/* ── SUGESTÃO LIVRE ── */}
            <section className="flex flex-col gap-3">
              <SectionHeader title="Sugestão Livre" />
              <p className="text-xs text-gray-400">Opcional</p>
              <textarea
                value={data.q26}
                onChange={(e) => setData((d) => ({ ...d, q26: e.target.value }))}
                placeholder="Comentários adicionais, sugestões de melhorias..."
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-[#E1343A] transition-colors"
              />
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#E1343A] text-white font-bold text-base rounded-2xl shadow-md active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: "0 4px 14px rgba(225,52,58,0.35)" }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Enviar Questionário"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 pb-4">
          SETEBAN · Seminário Teológico Batista Nacional
        </p>
      </div>
    </div>
  );
}
