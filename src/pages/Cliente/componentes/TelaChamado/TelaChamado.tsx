import "./TelaChamado.styles.scss";
import { ITelaChamado } from "./TelaChamado.types"

export default function TelaChamado({ senha }: ITelaChamado) {
  return (
    <div className="page">
      <div className="card chamado">
        <div className="pulse"></div>
        <div className="icon">🔔</div>
        <h2 className="titulo green">É a sua vez!</h2>
        <div className="senha">{senha}</div>
        <p className="sub">Dirija-se ao atendimento agora.</p>
      </div>
    </div>
  );
}