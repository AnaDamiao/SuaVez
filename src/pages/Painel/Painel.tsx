import { useEffect, useState } from "react";
import { escutarFila } from "../../services/filaService";
import { useParams } from "react-router-dom";
import "../Painel/Painel.styles.scss";

interface Fila {
  senhaAtual: number;
  ativa?: boolean;
}

export default function Painel() {
  const { filaId } = useParams<{ filaId: string }>();

  const [fila, setFila] = useState<Fila | null>(null);
  const [animacao, setAnimacao] = useState(false);

  useEffect(() => {
    if (!filaId) return;

    const unsub = escutarFila(filaId, (dados: Fila | null) => {
      if (dados) {
        setAnimacao(true);
        setTimeout(() => setAnimacao(false), 500);
        setFila(dados);
      }
    });

    return () => unsub();
  }, [filaId]);

  if (!fila) {
    return (
      <div className="painel-container carregando">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="painel-container">
      <div className="painel-content">
        <div className="painel-header">
          <div className="header-info">
            <span className="label-pequeno">Fila de Atendimento</span>
            <h2 className="titulo-fila">Chamada de Senha</h2>
          </div>
          <div className="status-badge">
            <span className="status-dot"></span>
            <span className="status-texto">Ativo</span>
          </div>
        </div>

        <div className={`painel-senha-area ${animacao ? "pulse" : ""}`}>
          <div className="senha-container">
            <span className="label-senha">SENHA ATUAL</span>
            <div className="numero-grande">{fila.senhaAtual}</div>
            <div className="separador"></div>
            <span className="label-guiche">Dirija-se ao Guichê</span>
          </div>
        </div>

        <div className="painel-footer">
          <div className="footer-item">
            <span className="footer-label">Status:</span>
            <span className="footer-valor status-ativo">Chamando</span>
          </div>
          <div className="footer-separator"></div>
          <div className="footer-item">
            <span className="footer-label">Fila ID:</span>
            <span className="footer-valor">{filaId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}