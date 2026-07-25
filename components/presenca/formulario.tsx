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
  User,
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
  const [escalado, setEscalado] = useState<PresencaData["usuario"]>();

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

  const escalaUsuario = (user: PresencaData["usuario"] | undefined) =>
    user && (
      <section className="flex items-center gap-3 rounded-2xl border border-(--accent-4) bg-(--accent-2) px-4 py-3 shadow-sm">
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--accent-9)/10 text-sm font-semibold"
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
          <p className="truncate text-xs">
            {dadosIniciais.usuario.ministerio} · {dadosIniciais.usuario.funcao}
          </p>
        </div>
      </section>
    );

  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4  py-6 sm:max-w-lg bg-(--accent-2) rounded-lg shadow-md">
        {/* Cabeçalho de navegação */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-(--accent-12) bg-(--accent-12) text-(--accent-4) transition-colors hover:bg-(--accent-11) hover:text-(--accent-4)"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </Link>
          <h1 className="text-xl font-semibold">
            {modo === "editar" ? "Editar presença" : "Lançar presença"}
          </h1>
        </div>

        <form
          id="formulario-presenca"
          onSubmit={aoEnviar}
          className="flex flex-col gap-6"
        >
          {/* Dia e horário — fixos, não editáveis */}
          <section className="rounded-2xl bg-(--accent-1) px-4 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 opacity-80" strokeWidth={2} />
              <span className="capitalize">{diaFormatado}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 opacity-80" strokeWidth={2} />
              <span>{horaFormatada}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <User className="h-4 w-4 opacity-80" strokeWidth={2} />
              <span>{dadosIniciais.usuario.nome}</span>
            </div>
          </section>

          {/* Titular ou substituição */}
          <section className="flex flex-col gap-2">
            <h2 className="px-1 text-sm font-semibold">
              Como você está servindo hoje?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <BlocoRadio
                nome="tipo-participacao"
                valor="titular"
                selecionado={tipo === "titular"}
                aoSelecionar={() => {
                  setTipo("titular");
                  setEscalado(dadosIniciais.usuario);
                }}
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
                className="px-1 text-sm font-semibold"
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
                    "w-full appearance-none rounded-lg border border-(--accent-6) bg-(--accent-2) px-4 py-3 pr-10 text-sm shadow-sm",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-8)",
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
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
                />
              </div>
            </section>
          )}
          {escalaUsuario(escalado)}
        </form>
        <button
          type="submit"
          form="formulario-presenca"
          disabled={!podeEnviar || enviando}
          className={cn(
            "w-full rounded-lg bg-(--accent-9) py-3.5 text-center text-sm font-semibold text-(--accent-4) shadow-md transition-colors",
            "hover:bg-(--accent-10) disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {enviando
            ? "Salvando..."
            : modo === "editar"
              ? "Salvar alterações"
              : "Registrar presença"}
        </button>
      </div>

      {/* Ação principal fixa no rodapé — fácil de alcançar no mobile */}
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
          ? "border-(--accent-11) bg-(--accent-9) text-(--accent-4)"
          : "border-(--accent-5) bg-(--accent-2) hover:border-(--accent-8)",
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
      <Icone className="h-5 w-5" strokeWidth={2} />
      <span>
        <span className="block text-sm font-semibold leading-tight">
          {rotulo}
        </span>
        <span className="mt-0.5 block text-xs leading-snug ">{descricao}</span>
      </span>
    </label>
  );
}
