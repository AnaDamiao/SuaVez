import type { EstimativaEspera } from "../../estimativaEspera";

export interface ITelaAguardando {
  senha: number;
  senhaAtual: number;
  posicao: number | null;
  confirmando: boolean;
  onCancelar: () => void;
  onVoltar: () => void;
  tempoEstimado: EstimativaEspera | null;
}