import "./TelaEncerrada.styles.scss";

interface ITelaEncerrada {
  posicao?: number | null;
}

export default function TelaEncerrada({ posicao }: ITelaEncerrada) {
  const pessoasAFrente = posicao !== null && posicao !== undefined ? posicao : null;

  return (
    <div className="page">
      <div className="card">
        <div className="icon muted">⏸</div>
        <h2 className="titulo">Fila encerrada</h2>
        <p className="sub">O atendimento foi finalizado.</p>
        {pessoasAFrente !== null && (
          <p className="sub destaque">
            Havia {pessoasAFrente} pessoa{pessoasAFrente === 1 ? "" : "s"} à sua frente.
          </p>
        )}
      </div>
    </div>
  );
}