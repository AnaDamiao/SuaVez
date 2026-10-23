export interface Senha {
  numero: number;
  senhaDocId: string;
  chamadaEm?: number;
}

export interface FilaDados {
  ativa: boolean;
  senhaAtual: number;
  nome?: string;
  ultimaChamadaEm?: number;
  intervalosChamadasMs?: number[];
}

export interface SenhaDados {
  cancelada?: boolean;
}

export type Unsubscribe = () => void;