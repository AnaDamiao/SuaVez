import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  chamarProximaSenha,
  escutarFilaAdministrativa,
  escutarHistorico,
  finalizarFila,
} from "../../services/filaService";
import { useAuth } from "../../firebase/AuthContext";
import "./Atendente.styles.scss";

interface Fila {
  ativa?: boolean;
  senhaAtual?: number;
  ultimaSenhaGerada?: number;
  aguardando?: number;
}

interface HistoricoItem {
  id?: string;
  senha?: number;
  chamadaEm?: number;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Atendente() {
  const { filaId } = useParams<{ filaId?: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [fila, setFila] = useState<Fila | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);
  const [animando, setAnimando] = useState(false);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    if (!filaId) {
      setFila(null);
      return;
    }

    const unsub = escutarFilaAdministrativa(filaId, (dados: Fila | null) => {
      setFila(dados ?? null);
    });

    return () => unsub();
  }, [filaId]);

  useEffect(() => {
    if (!filaId) {
      setHistorico([]);
      return;
    }

    const unsub = escutarHistorico(filaId, (dados: HistoricoItem[]) => {
      setHistorico(dados);
    });

    return () => unsub();
  }, [filaId]);

  async function chamar() {
    if (!filaId) return;

    if (!fila?.ativa) {
      alert("A fila já foi finalizada.");
      navigate("/");
      return;
    }

    setLoading(true);
    setAnimando(true);
    await chamarProximaSenha(filaId);
    setLoading(false);
    setTimeout(() => setAnimando(false), 600);
  }

  async function finalizar() {
    if (!filaId) return;

    await finalizarFila(filaId);
    navigate("/");
  }

  async function sair() {
    await logout();
    navigate("/login", { replace: true });
  }

  function tempoRelativo(timestamp?: number) {
    const valor = timestamp ?? Date.now();
    const segundos = Math.floor((Date.now() - valor) / 1000);

    if (segundos < 60) {
      return "Agora mesmo";
    }

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) {
      return `Há ${minutos} min`;
    }

    const horas = Math.floor(minutos / 60);
    return `Há ${horas}h`;
  }

  if (!filaId) {
    return null;
  }

  const qrUrl = `${window.location.origin}/totem/${filaId}`;
  const painelUrl = `${window.location.origin}/painel`;
  const aguardando = fila?.aguardando ?? 0;
  const filaAtiva = fila?.ativa !== false;

  return (
    <div className="atendente-page">
      <div className="atendente-navbar">
        <a href="/">
          <div className="totem-mark-header" aria-hidden="true">
              <img src="/logo_sua_vez.png"  alt="Sua Vez" />
          </div>
        </a>
        <span className="atendente-brand">Fila Digital</span>
        <button className="atendente-logout" onClick={sair}>Sair</button>
      </div>

      <div className="atendente-body">
        <div className="atendente-left-col">
          <div className="atendente-card-white">
            <p className="atendente-section-label">SENHA ATUAL</p>
            <div className={cx("atendente-senha-grande", animando && "atendente-senha-animando")}>
              {fila?.senhaAtual ?? "0000"}
            </div>
            <div className="atendente-guiche-tag">
              <span className="atendente-dot" />
              Fila única • Ativo
            </div>
          </div>

          <div className="atendente-actions-row">
            <button
              className={cx("atendente-btn-proxima", (loading || !fila?.ativa) && "atendente-btn-disabled")}
              onClick={chamar}
              disabled={loading || !fila?.ativa}
            >
              <div>
                <p className="atendente-btn-label">CHAMADA</p>
                <p className="atendente-btn-title">{loading ? "Chamando…" : "Próxima Senha"}</p>
              </div>
              <span className="atendente-arrow-icon">›</span>
            </button>

            {confirmFinalizar ? (
              <div className="atendente-confirm-card">
                <p className="atendente-confirm-text">Confirmar encerramento?</p>
                <div className="atendente-confirm-actions">
                  <button className="atendente-btn-sim" onClick={finalizar}>Sim, encerrar</button>
                  <button className="atendente-btn-nao" onClick={() => setConfirmFinalizar(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button className="atendente-btn-encerrar" onClick={() => setConfirmFinalizar(true)}>
                <div>
                  <p className="atendente-btn-label-cancel">FIM DE TURNO</p>
                  <p className="atendente-encerrar-title">Encerrar Fila</p>
                </div>
                <span className="atendente-close-icon">✕</span>
              </button>
            )}
          </div>

          <div>
            <div className="atendente-historico-header">
              <p className="atendente-historico-title">Últimos Atendimentos</p>
              <a href="#" className="atendente-ver-mais">Ver histórico completo ↗</a>
            </div>
            <div className="atendente-historico-grid">
              {historico.length === 0 ? (
                <div className="atendente-sem-historico">Nenhuma senha foi chamada ainda</div>
              ) : (
                historico.slice(0, 6).map((h) => (
                  <div
                    key={h.id ?? `${h.senha ?? "senha"}-${h.chamadaEm ?? 0}`}
                    className="atendente-historico-card"
                  >
                    <p className="atendente-historico-senha">{h.senha ?? 0}</p>
                    <p className="atendente-historico-status">CHAMADA</p>
                    <p className="atendente-historico-tempo">{tempoRelativo(h.chamadaEm ?? Date.now())}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="atendente-right-col">
          <div className="atendente-card-beige">
            <p className="atendente-card-beige-label">EM ESPERA</p>
            <p className="atendente-card-beige-num">{aguardando}</p>
          </div>

          <a href={painelUrl} target="_blank" rel="noreferrer" className="atendente-link-card">
            <span className="atendente-link-card-text">Painel Público</span>
          </a>
          <a href={qrUrl} target="_blank" rel="noreferrer" className="atendente-link-card">
            <span className="atendente-link-card-text">QR Code</span>
          </a>

          <div className="atendente-status-card">
            <p className="atendente-status-label">STATUS DA FILA</p>
            <div className="atendente-status-row">
              <div
                className={cx(
                  "atendente-status-dot",
                  filaAtiva ? "atendente-status-dot-ativa" : "atendente-status-dot-encerrada"
                )}
              />
              <span className="atendente-status-text">{filaAtiva ? "Ativa" : "Encerrada"}</span>
            </div>

            <div className="atendente-status-meta">
              <div className="atendente-stat-item">
                <p className="atendente-stat-val">{fila?.ultimaSenhaGerada}</p>
                <p className="atendente-stat-key">Última gerada</p>
              </div>
              <div className="atendente-stat-item">
                <p className="atendente-stat-val">{aguardando || 0}</p>
                <p className="atendente-stat-key">Aguardando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}