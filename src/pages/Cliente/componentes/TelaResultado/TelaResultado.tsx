import "./TelaResultado.styles.scss";

interface Props {
  nomeFila: string;
  senha: number;
  senhaAtual: number;
  chamadaEm?: number;
  loading: boolean;
  onPegarOutraSenha: () => void;
}

export default function TelaResultado({
  nomeFila,
  senha,
  senhaAtual,
  chamadaEm,
  loading,
  onPegarOutraSenha,
}: Props) {
  const horario = chamadaEm
    ? new Date(chamadaEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "Horário indisponível";

  return (
    <div className="page">
      <div className="card resultado-cliente">
        <p className="comprovante-fila-nome">{nomeFila}</p>
        <p className="label">SUA SENHA FOI CHAMADA</p>
        <div className="senha">{senha}</div>
        <p className="resultado-horario">Chamada às {horario}</p>

        <div className="info-row">
          <div className="info-box">
            <span className="info-num">{senhaAtual || "—"}</span>
            <span className="info-label">senha atual</span>
          </div>
        </div>

        <p className="resultado-instrucao">Esta tela ficará disponível até você retirar outra senha nesta fila.</p>

        <button className="btn-primary resultado-nova-senha" onClick={onPegarOutraSenha} disabled={loading}>
          {loading ? "Retirando senha…" : "Pegar outra senha nesta fila"}
        </button>
      </div>
    </div>
  );
}
