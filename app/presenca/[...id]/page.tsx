import { FormularioPresenca } from "@/components/presenca/formulario";
import type { PessoaEscalada, PresencaData } from "@/lib/presenca/tipos";

interface PageProps {
  // Rota [[...id]]: sem segmento -> id undefined (nova presença).
  // Com segmento, ex. /presenca/lancar/123 -> id = ["123"] (edição).
  params: Promise<{ id?: string[] }>;
}

// ---- Mocks — troque pelas chamadas reais ao seu backend --------------

async function getUsuarioLogado() {
  return {
    nome: "Marcos Andrade",
    ministerio: "Louvor",
    funcao: "Vocal",
  };
}

async function getPessoasEscaladasHoje(): Promise<PessoaEscalada[]> {
  return [
    { id: "p1", nome: "Marcos Andrade", ministerio: "Louvor" },
    { id: "p2", nome: "Juliana Prado", ministerio: "Louvor" },
    { id: "p3", nome: "Rafael Souza", ministerio: "Mídia" },
    { id: "p4", nome: "Camila Torres", ministerio: "Recepção" },
  ];
}

async function getPresencaPorId(id: string): Promise<PresencaData | null> {
  // Simula uma presença já lançada, para o fluxo de edição.
  return {
    id,
    dataHoraISO: new Date().toISOString(),
    usuario: {
      nome: "Marcos Andrade",
      ministerio: "Louvor",
      funcao: "Vocal",
    },
    tipo: "substituicao",
    substituidoId: "p2",
  };
}

// -----------------------------------------------------------------------

export default async function LancarPresencaPage({ params }: PageProps) {
  const { id } = await params;
  const presencaId = id?.[0];
  const isEdicao = Boolean(presencaId) && presencaId !== "nova";

  const pessoasEscaladas = await getPessoasEscaladasHoje();

  const initialData: PresencaData = isEdicao
    ? ((await getPresencaPorId(presencaId as string)) ?? {
        dataHoraISO: new Date().toISOString(),
        usuario: await getUsuarioLogado(),
        tipo: "titular",
      })
    : {
        dataHoraISO: new Date().toISOString(),
        usuario: await getUsuarioLogado(),
        tipo: "titular",
      };

  return (
    <FormularioPresenca
      modo={isEdicao ? "editar" : "criar"}
      dadosIniciais={initialData}
      pessoasEscaladas={pessoasEscaladas}
    />
  );
}
