import "./TelaEntrada.styles.scss";
import { ITelaEntrada } from "./TelaEntrada.types";


export default function TelaEntrada({ onPegarSenha, loading }: ITelaEntrada) {
  return (
    <div className="page">
      <div className="card">
        <h1 className="titulo">Fila Digital</h1>
        <p className="sub">
          Retire sua senha e acompanhe o atendimento pelo celular.
        </p>

        <button className="btn-primary" onClick={onPegarSenha} disabled={loading}>
          {loading ? "Gerando…" : "Retirar senha"}
        </button>
      </div>
    </div>
  );
}