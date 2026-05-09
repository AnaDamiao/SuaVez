import "./TelaCancelada.styles.scss";
import type { ITelaCancelada } from "./TelaCancelada.types";

export default function TelaCancelada({ onReset } : ITelaCancelada) {
  return (
    <div className="page">
      <div className="card">
        <div className="icon red">✕</div>
        <h2 className="titulo">Senha cancelada</h2>
        <p className="sub">Você saiu da fila.</p>

        <button className="btn-primary" onClick={onReset}>
          Nova senha
        </button>
      </div>
    </div>
  );
}