import "./IniciarFila.styles.scss";

interface InicioFilaProps {
  nomeFila: string;
  setNomeFila: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onSubmit: () => void;
}

export function InicioFila({
  nomeFila,
  setNomeFila,
  loading,
  onSubmit,
}: InicioFilaProps) {
  return (
    <div className="page">
      <header className="navbar">
        <span className="brand">Fila Digital</span>
        <div className="nav-icons">
          <button className="icon-btn" aria-label="Ajuda">?</button>
          <button className="icon-btn" aria-label="Usuário">👤</button>
        </div>
      </header>

      <div className="card">
        <p className="tag">Terminal de Atendimento</p>
        <h1 className="titulo">
          Defina o fluxo de <span className="titulo-accent">atendimento</span>
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

      </div>
  );
}