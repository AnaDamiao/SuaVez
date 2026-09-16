export interface Senha {
  numero: number;
  senhaDocId: string;
}

export interface FilaDados {
  ativa: boolean;
  senhaAtual: number;
  ultimaChamadaEm?: number;
  intervalosChamadasMs?: number[];
}

export interface SenhaDados {
  cancelada?: boolean;
}

export type Unsubscribe = () => void;