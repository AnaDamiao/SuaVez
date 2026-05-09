import "./TelaAguardando.styles.scss";
import type { ITelaAguardando } from "./TelaAguardando.types";

export default function TelaAguardando({
  senha,
  senhaAtual,
  posicao,
  confirmando,
  onCancelar,
  onVoltar
} : ITelaAguardando) {
  return (
    <div className="page">
      <div className="card">
        <p className="label">SUA SENHA</p>
        <div className="senha">{senha}</div>

        <div className="info-row">
          <div className="info-box">
            <span className="info-num">{senhaAtual || "—"}</span>
            <span className="info-label">chamada agora</span>
          </div>

          <div className="divider" />

          <div className="info-box">
            <span className="info-num">{posicao ?? "…"}</span>
            <span className="info-label">à sua frente</span>
          </div>
        </div>

        <div className="status">
          {posicao === 0 ? (
            <span className="proximo">⚡ Você é o próximo!</span>
          ) : (
            <span>
              Aguarde — posição <strong>{posicao !== null ? posicao + 1 : "…"}</strong>
            </span>
          )}
        </div>

        {confirmando ? (
          <div className="confirm">
            <p>Tem certeza que deseja cancelar?</p>
            <div className="actions">
              <button className="btn-danger" onClick={onCancelar}>
                Sim
              </button>
              <button className="btn-secondary" onClick={onVoltar}>
                Voltar
              </button>
            </div>
          </div>
        ) : (
          <button className="btn-secondary" onClick={onCancelar}>
            Cancelar senha
          </button>
        )}
      </div>
    </div>
  );
}