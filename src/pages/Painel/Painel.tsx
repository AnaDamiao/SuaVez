import { useEffect, useState } from "react";
import { escutarFilaAdministrativa, escutarFilaAtiva } from "../../services/filaService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import "../Painel/Painel.styles.scss";

interface Fila {
  id: string;
  senhaAtual: number;
  ativa?: boolean;
  nome?: string;
}

export default function Painel() {
  const { filaId } = useParams<{ filaId?: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [fila, setFila] = useState<Fila | null>(null);
  const [animacao, setAnimacao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    setFila(null);

    const atualizarFila = (dados: Fila | null) => {
      if (dados) {
        setAnimacao(true);
        setTimeout(() => setAnimacao(false), 500);
      }

      setFila(dados);
      setCarregando(false);
    };

    const unsub = filaId
      ? escutarFilaAdministrativa(filaId, (dados: Fila | null) => {
          atualizarFila(dados ? { ...dados, id: filaId } : null);
        })
      : escutarFilaAtiva((dados: Fila | null) => {
          atualizarFila(dados);
        });

    return () => unsub();
  }, [filaId]);

  async function sair() {
    await logout();
    navigate("/login", { replace: true });
  }

  if (carregando) {
    return (
      <div className="painel-container carregando">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  const filaAtiva = Boolean(fila && fila.ativa !== false);
  const numeroSenha = filaAtiva ? fila?.senhaAtual ?? "00" : "----";
  const titulo = filaAtiva ? "Chamada de Senha" : "Fila Inativa";
  const statusTexto = filaAtiva ? "Ativo" : "Inativo";
  const footerStatus = filaAtiva ? "Chamando" : "Nenhuma fila aberta";
  const labelGuiche = filaAtiva ? "Dirija-se ao Guichê" : "Aguardando abertura de fila";
  const badgeClass = filaAtiva ? "status-ativo" : "status-inativo";
  const filaIdExibida = fila?.id || filaId || "-";

  return (
    <div className={`painel-container ${filaAtiva ? "" : "painel-inativo"}`}>
      <div className="painel-content">
        <div className="painel-header">
          <div className="header-info">
            <span className="label-pequeno">Fila de Atendimento</span>
            <h2 className="titulo-fila">{titulo}</h2>
          </div>
          <div className="painel-header-acoes">
            <div className={`status-badge ${badgeClass}`}>
              <span className="status-dot"></span>
              <span className="status-texto">{statusTexto}</span>
            </div>
            <button className="painel-logout" onClick={sair}>
              Sair
              <img className="icon-out" src="/logout.svg" alt="Sua Vez" />
            </button>
          </div>
        </div>

        <div className={`painel-senha-area ${filaAtiva ? "" : "inativo"} ${animacao ? "pulse" : ""}`}>
          <div className="senha-container">
            <span className="label-senha">{filaAtiva ? "SENHA ATUAL" : "SINAL INATIVO"}</span>
            <div className="numero-grande">{numeroSenha}</div>
            <div className="separador"></div>
            <span className="label-guiche">{labelGuiche}</span>
          </div>
        </div>

        <div className="painel-footer">
          <div className="footer-item">
            <span className="footer-label">Status:</span>
            <span className={`footer-valor ${badgeClass}`}>{footerStatus}</span>
          </div>
          <div className="footer-separator"></div>
          <div className="footer-item">
            <span className="footer-label">Fila ID:</span>
            <span className="footer-valor">{filaIdExibida}</span>
          </div>
        </div>
      </div>
    </div>
  );
}