"use client";
import {
  CalendarCheck2,
  CalendarDays,
  Users,
  Megaphone,
  Percent,
  Cake,
  ListChecks,
} from "lucide-react";
import { ActionTile } from "@/components/dashboard/action-tile";
import { PlaceholderPanel } from "@/components/dashboard/placeholder-panel";
import { Card } from "@radix-ui/themes";

// Troque pelos dados reais (sessão do usuário, igreja ativa, etc.)
const contexto = {
  nomeUsuario: "Marcos",
  ministerio: "Louvor",
  funcao: "Vocal",
  data: new Date("2026-07-26T18:00:00"),
};

export default function DashboardPage() {
  return (
    <div className={`min-h-dvh `}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 pb-10 pt-6 sm:max-w-2xl">
        <Card
          className="relative overflow-hidden bg-(--accent-1)"
          variant="surface"
          size="3"
        >
          <div
            aria-hidden
            className="absolute -right-7 -top-8 h-38 w-38 rounded-full bg-(--accent-5)"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h1 className="mt-1  leading-none">
                PRÓXIMA
                <br />
                ESCALA
              </h1>
              <h3 className="mt-1 capitalize ">
                {`${contexto.data.getHours()}h${contexto.data.getMinutes() ? String(contexto.data.getMinutes()).padStart(2, "0") : ""}`}{" "}
                · {contexto.ministerio} · {contexto.funcao}
              </h3>
            </div>

            {/* Selo de data, estilo canhoto de ingresso/boletim */}
            <div className="flex w-14 flex-col items-center py-2 gap-1 text-(--accent-12)">
              <span className="text-[20px] font-bold leading-1">
                {contexto.data
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .toUpperCase()}
              </span>
              <span className="text-[40px] font-extrabold leading-none">
                {String(contexto.data.getDate()).padStart(2, "0")}
              </span>
            </div>
          </div>
        </Card>

        {/* Ações principais — 4 botões grandes, prontos para o polegar */}
        <section aria-label="Ações rápidas" className="grid grid-cols-2 gap-3">
          <ActionTile
            href="/presenca/nova"
            label="Lançar presença"
            description="Registre sua presença"
            icon={CalendarCheck2}
            emphasis
          />
          <ActionTile
            href="/escalas"
            label="Calendário de Escalas"
            description="Se programe"
            icon={CalendarDays}
          />
          <ActionTile
            href="/equipes"
            label="Equipes"
            description="Ministérios e voluntários"
            icon={Users}
          />
          <ActionTile
            href="/avisos"
            label="Avisos"
            description="Comunicados da liderança"
            icon={Megaphone}
          />
        </section>

        {/* Área reservada para indicadores e gráficos futuros */}
        <section aria-label="Indicadores" className="flex flex-col gap-3">
          <h2 className="px-1 text-sm font-bold">Indicadores</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PlaceholderPanel
              title="Taxa de presença"
              hint="Gráfico em breve"
              icon={Percent}
            />
            <PlaceholderPanel
              title="Próximas escalas"
              hint="Lista em breve"
              icon={ListChecks}
            />
            <PlaceholderPanel
              title="Aniversariantes do mês"
              hint="Lista em breve"
              icon={Cake}
              className="sm:col-span-2"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
