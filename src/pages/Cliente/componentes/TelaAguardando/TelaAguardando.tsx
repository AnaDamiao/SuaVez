import "./TelaAguardando.styles.scss";
import type { ITelaAguardando } from "./TelaAguardando.types";

export default function TelaAguardando({
  senha,
  nomeFila,
  senhaAtual,
  posicao,
  confirmando,
  onCancelar,
  onVoltar,
  tempoEstimado
} : ITelaAguardando) {
  return (
    <div className="page">
      <div className="card">
        <p className="comprovante-fila-nome">{nomeFila}</p>
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
            <div className="status-content">
              <span className="proximo">Você é o próximo!</span>
            </div>
          ) : (
            <div className="status-content">
              <span>
                Aguarde. Sua posição atual é: {" "}
                <strong>{posicao !== null ? posicao + 1 : "…"}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="estimativa-espera">
          <span className="estimativa-titulo">Tempo aproximado até sua chamada</span>
          {tempoEstimado ? (
            <>
              <strong className="estimativa-contador">
                {tempoEstimado.segundos > 0
                  ? [Math.floor(tempoEstimado.segundos / 60), tempoEstimado.segundos % 60].map(valor => String(valor).padStart(2, "0")).join(":")
                  : "Aguardando chamada"}
              </strong>
              <span className="tempo">
                Entre {tempoEstimado.minimoMinutos} e {tempoEstimado.maximoMinutos} min
              </span>
              <small className="tempo">
                {tempoEstimado.amostras === 1
                  ? "Estimativa inicial baseada no último intervalo entre chamadas."
                  : "Baseado nos últimos atendimentos."}
                {" "}Podendo variar.
              </small>
              {tempoEstimado.atrasada && (
                <small className="tempo">Sua espera ultrapassou a estimativa. O tempo será recalculado na próxima chamada.</small>
              )}
            </>
          ) : (
            <small className="tempo">Calculando estimativa. Aguardando os primeiros intervalos entre chamadas.</small>
          )}
        </div>

        <div className="actions_btns">
          <button className="btn-comprovante" onClick={() => window.print()}>
            Salvar comprovante em PDF
          </button>

          {confirmando ? (
            <div className="confirm">
              <p>Tem certeza que deseja cancelar?</p>
              <div className="actions">
                <button className="btn-yes" onClick={onCancelar}>
                  Sim
                </button>
                <button className="btn-back" onClick={onVoltar}>
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-cancel" onClick={onCancelar}>
              Cancelar senha
            </button>
          )}
        </div>
      </div>
    </div>
  );
}