export interface PessoaEscalada {
  id: string;
  nome: string;
  ministerio: string;
}

export interface PresencaData {
  id?: string;
  /** Data/horário do culto ao qual essa presença se refere — nunca editável na tela. */
  dataHoraISO: string;
  usuario: {
    nome: string;
    ministerio: string;
    funcao: string;
  };
  tipo: "titular" | "substituicao";
  substituidoId?: string;
}
