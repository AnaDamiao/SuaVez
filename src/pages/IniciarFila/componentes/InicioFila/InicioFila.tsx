import "./IniciarFila.styles.scss";
import type { Dispatch, SetStateAction } from "react";

interface FilaAtiva {
  id: string;
  nome?: string;
  senhaAtual?: number;
  ultimaSenhaGerada?: number;
}

interface InicioFilaProps {
  nomeFila: string;
  setNomeFila: Dispatch<SetStateAction<string>>;
  loading: boolean;
  onSubmit: () => void;
  filasAtivas: FilaAtiva[];
  onAbrirFila: (filaId: string) => void;
}

export function InicioFila({
  nomeFila,
  setNomeFila,
  loading,
  onSubmit,
  filasAtivas,
  onAbrirFila,
}: InicioFilaProps) {
  return (
    <div className="page">
      <header className="navbar">
        <span className="brand">Fila Digital</span>
       
      </header>

      <div className="card">
        <p className="tag">Terminal de Atendimento</p>
        <h1 className="titulo">
          Defina o fluxo de atendimento
        </h1>

        <div className="inputGroup">
          <label className="label">Nome da Fila / Setor</label>
          <div className="inputWrap">
            <span className="inputIcon">✳</span>
            <input
              className="input"
              placeholder="Ex: Recepção, Triagem, Caixa..."
              value={nomeFila}
              onChange={(e) => setNomeFila(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
            />
          </div>
          <p className="inputHint">Identifique o ponto de atendimento para os clientes.</p>
        </div>

        <button className="btn" onClick={onSubmit} disabled={loading}>
          {loading ? "Criando…" : "Iniciar Atendimento →"}
        </button>

        <div className="cardFooter">
          <div className="status">
            <span className="statusDot" />
            Sistema Online
          </div>
          <div className="footerLinks">
            <a href="#">Configurações</a>
            <a href="#">Sair</a>
          </div>
        </div>
      </div>

      <section className="activeQueues">
        <div className="activeQueuesHeader">
          <div>
            <p className="tag tagSecondary">Filas abertas</p>
            <h2 className="activeQueuesTitle">Acesse uma fila ativa</h2>
          </div>
          <span className="activeQueuesCount">
            {filasAtivas.length} ativa{filasAtivas.length === 1 ? "" : "s"}
          </span>
        </div>

        {filasAtivas.length === 0 ? (
          <div className="emptyState">
            Nenhuma fila está aberta no momento.
          </div>
        ) : (
          <div className="queueList">
            {filasAtivas.map((fila) => (
              <button
                key={fila.id}
                className="queueCard"
                onClick={() => onAbrirFila(fila.id)}
              >
                <div>
                  <p className="queueName">{fila.nome || "Fila sem nome"}</p>
                  <p className="queueMeta">ID: {fila.id}</p>
                </div>
                <span className="queueAction">Abrir atendimento →</span>
              </button>
            ))}
          </div>
        )}
      </section>

      </div>
  );
}