"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  UserCheck,
  Repeat,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PessoaEscalada, PresencaData } from "@/lib/presenca/tipos";

interface FormularioPresencaProps {
  modo: "criar" | "editar";
  dadosIniciais: PresencaData;
  pessoasEscaladas: PessoaEscalada[];
}

type TipoParticipacao = "titular" | "substituicao";

export function FormularioPresenca({
  modo,
  dadosIniciais,
  pessoasEscaladas,
}: FormularioPresencaProps) {
  const [tipo, setTipo] = useState<TipoParticipacao>(dadosIniciais.tipo);
  const [substituidoId, setSubstituidoId] = useState(
    dadosIniciais.substituidoId ?? "",
  );
  const [enviando, setEnviando] = useState(false);

  const data = useMemo(
    () => new Date(dadosIniciais.dataHoraISO),
    [dadosIniciais.dataHoraISO],
  );

  const diaFormatado = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }).format(data),
    [data],
  );

  const horaFormatada = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(data),
    [data],
  );

  // Não faz sentido a pessoa aparecer como opção de "quem estou substituindo".
  const opcoesSubstituicao = pessoasEscaladas.filter(
    (p) => p.nome !== dadosIniciais.usuario.nome,
  );

  const podeEnviar =
    tipo === "titular" || (tipo === "substituicao" && substituidoId);

  async function aoEnviar(event: React.FormEvent) {
    event.preventDefault();
    if (!podeEnviar) return;

    setEnviando(true);
    // Troque pela chamada real (server action / API).
    const payload = {
      id: dadosIniciais.id,
      dataHoraISO: dadosIniciais.dataHoraISO,
      tipo,
      substituidoId: tipo === "substituicao" ? substituidoId : undefined,
    };
    console.log("Enviando presença", payload);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setEnviando(false);
  }

  return (
    <div className="min-h-dvh bg-parish-bg text-parish-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 pb-28 pt-6 sm:max-w-lg">
        {/* Cabeçalho de navegação */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-parish-border bg-parish-surface text-parish-text transition-colors hover:bg-parish-border/30"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold">
            {modo === "editar" ? "Editar presença" : "Lançar presença"}
          </h1>
        </div>

        <form
          id="formulario-presenca"
          onSubmit={aoEnviar}
          className="flex flex-col gap-6"
        >
          {/* Dia e horário — fixos, não editáveis */}
          <section className="rounded-2xl bg-parish-primary px-4 py-4 text-parish-primary-foreground shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 opacity-80" strokeWidth={2} />
              <span className="capitalize">{diaFormatado}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 opacity-80" strokeWidth={2} />
              <span>{horaFormatada}</span>
            </div>
          </section>

          {/* Dados do usuário — somente leitura */}
          <section className="flex items-center gap-3 rounded-2xl border border-parish-border bg-parish-surface px-4 py-3 shadow-sm">
            <div
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-parish-primary/10 font-[family-name:var(--font-display)] text-sm font-semibold text-parish-primary"
            >
              {dadosIniciais.usuario.nome
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {dadosIniciais.usuario.nome}
              </p>
              <p className="truncate text-xs text-parish-muted">
                {dadosIniciais.usuario.ministerio} ·{" "}
                {dadosIniciais.usuario.funcao}
              </p>
            </div>
          </section>

          {/* Titular ou substituição */}
          <section className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-semibold text-parish-muted">
              Como você está servindo hoje?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <BlocoRadio
                nome="tipo-participacao"
                valor="titular"
                selecionado={tipo === "titular"}
                aoSelecionar={() => setTipo("titular")}
                icone={UserCheck}
                rotulo="Minha escala"
                descricao="Estou cumprindo minha vez"
              />
              <BlocoRadio
                nome="tipo-participacao"
                valor="substituicao"
                selecionado={tipo === "substituicao"}
                aoSelecionar={() => setTipo("substituicao")}
                icone={Repeat}
                rotulo="Substituição"
                descricao="Estou no lugar de alguém"
              />
            </div>
          </section>

          {/* Select do substituído — só aparece quando necessário */}
          {tipo === "substituicao" && (
            <section className="flex flex-col gap-2">
              <label
                htmlFor="substituido"
                className="px-1 text-sm font-semibold text-parish-muted"
              >
                Quem você está substituindo
              </label>
              <div className="relative">
                <select
                  id="substituido"
                  required
                  value={substituidoId}
                  onChange={(event) => setSubstituidoId(event.target.value)}
                  className={cn(
                    "w-full appearance-none rounded-xl border border-parish-border bg-parish-surface px-4 py-3 pr-10 text-sm text-parish-text shadow-sm",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-parish-primary/50",
                  )}
                >
                  <option value="" disabled>
                    Selecione quem estava escalado
                  </option>
                  {opcoesSubstituicao.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} · {pessoa.ministerio}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-parish-muted"
                />
              </div>
            </section>
          )}
        </form>
      </div>

      {/* Ação principal fixa no rodapé — fácil de alcançar no mobile */}
      <div className="fixed inset-x-0 bottom-0 border-t border-parish-border bg-parish-bg/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto w-full max-w-md sm:max-w-lg">
          <button
            type="submit"
            form="formulario-presenca"
            disabled={!podeEnviar || enviando}
            className={cn(
              "w-full rounded-xl bg-parish-primary py-3.5 text-center text-sm font-semibold text-parish-primary-foreground shadow-md transition-colors",
              "hover:bg-parish-primary-hover disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {enviando
              ? "Salvando..."
              : modo === "editar"
                ? "Salvar alterações"
                : "Registrar presença"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface BlocoRadioProps {
  nome: string;
  valor: string;
  selecionado: boolean;
  aoSelecionar: () => void;
  icone: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  rotulo: string;
  descricao: string;
}

function BlocoRadio({
  nome,
  valor,
  selecionado,
  aoSelecionar,
  icone: Icone,
  rotulo,
  descricao,
}: BlocoRadioProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-3 shadow-sm transition-colors",
        selecionado
          ? "border-parish-primary bg-parish-primary/5"
          : "border-parish-border bg-parish-surface hover:border-parish-primary/40",
      )}
    >
      <input
        type="radio"
        name={nome}
        value={valor}
        checked={selecionado}
        onChange={aoSelecionar}
        className="sr-only"
      />
      <Icone
        className={cn(
          "h-5 w-5",
          selecionado ? "text-parish-primary" : "text-parish-muted",
        )}
        strokeWidth={2}
      />
      <span>
        <span className="block text-sm font-semibold leading-tight">
          {rotulo}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-parish-muted">
          {descricao}
        </span>
      </span>
    </label>
  );
}
