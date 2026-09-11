export interface ITelaEntrada {
  onPegarSenha: (telefone: string) => Promise<void>;
  loading: boolean;
  erro: string;
}
