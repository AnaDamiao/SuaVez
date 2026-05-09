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
      <div className="card">
        <div className="icon">🏷️</div>
        <h1 className="titulo">Fila Digital</h1>
        <p className="sub">
          Sistema de gerenciamento de filas com QR Code
        </p>

        <div className="inputGroup">
          <label className="label">Nome da fila (opcional)</label>
          <input
             className="input"
            placeholder="Ex: Atendimento geral"
            value={nomeFila}
            onChange={(e) => setNomeFila(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
          />
        </div>

        <button
          className="btn"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Criando…" : "Iniciar atendimento"}
        </button>
      </div>
    </div>
  );
}