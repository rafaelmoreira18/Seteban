create table if not exists form_responses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Bloco 1 — Perfil Pessoal
  q1  text,  -- Idade
  q2  text,  -- Gênero
  q3  text,  -- Denominação
  q4  text,  -- Ministério na igreja
  q5  text,  -- Curso superior em outra área

  -- Bloco 2 — Trajetória no Seminário
  q6  text,  -- Tempo de estudo
  q7  text,  -- Como conheceu
  q8  text,  -- Quem incentivou
  q9  text,  -- Rotina

  -- Bloco 3 — Motivação e Vocação
  q10 text[], -- Motivo principal (múltipla escolha)

  -- Bloco 4 — Continuidade e Dificuldades
  q11 text,   -- Pensou em parar
  q12 text[], -- Motivos para parar (múltipla escolha)

  -- Bloco 5 — Igreja Local e o Seminário
  q13 text,   -- Suporte da igreja
  q14 text,   -- Conhece alguém que gostaria estudar
  q15 text[], -- Motivos comuns (múltipla escolha)

  -- Bloco 6 — Conteúdo e Experiência
  q17 text,  -- Aplicabilidade do conteúdo
  q20 text,  -- Avaliação do relacionamento (escala 1–5)

  -- Bloco 7 — Missão e Plantio
  q21 text,  -- Igreja plantou congregação
  q22 text,  -- Interesse em plantio
  q23 text,  -- Preparado para missões urbanas

  -- Sugestão Livre
  q26 text   -- Comentários adicionais
);

-- Habilita RLS
alter table form_responses enable row level security;

-- Permite inserção anônima (formulário público)
create policy "allow_anon_insert"
  on form_responses
  for insert
  to anon
  with check (true);

-- Somente usuários autenticados podem ler
create policy "allow_authenticated_select"
  on form_responses
  for select
  to authenticated
  using (true);
