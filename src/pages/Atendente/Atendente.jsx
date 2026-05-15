import { chamarProximaSenha, finalizarFila, escutarFila, escutarHistorico} from "../../services/filaService";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Atendente() {
  const { filaId } = useParams();
  const navigate = useNavigate();

  const [fila, setFila] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);
  const [animando, setAnimando] = useState(false);
  // const [tab, setTab] = useState("dashboard");
  const [tempoRestante, setTempoRestante] = useState(0);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const unsub = escutarFila(filaId, setFila);
    return () => unsub();
  }, [filaId]);

  useEffect(() => {
    const aguardando =
      Math.max(
        0,
        (fila?.ultimaSenhaGerada || 0) - (fila?.senhaAtual || 0)
      );

    // Sem fila = sem espera
    if (aguardando <= 0) {
      setTempoRestante(0);
      return;
    }

    const ultimaChamada = fila?.ultimaChamadaEm;

    if (!ultimaChamada) {
      setTempoRestante(300);
      return;
    }

    function atualizarTempo() {
      const agora = Date.now();
      const segundosPassados = Math.floor((agora - ultimaChamada) / 1000);

      const restante = Math.max(300 - segundosPassados, 0);

      setTempoRestante(restante);
    }

    atualizarTempo();

    const interval = setInterval(atualizarTempo, 1000);

    return () => clearInterval(interval);
  }, [fila]);

  async function chamar() {
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
    await finalizarFila(filaId);
    navigate("/");
  }

  const qrUrl = `${window.location.origin}/qr/${filaId}`;
  const painelUrl = `${window.location.origin}/painel/${filaId}`;

  const aguardando = Math.max(0, (fila?.ultimaSenhaGerada || 0) - (fila?.senhaAtual || 0));


  useEffect(() => {
    const unsub = escutarHistorico(filaId, setHistorico);

    return () => unsub();
  }, [filaId]);

  function formatarTempo(segundos) {
      const min = Math.floor(segundos / 60);
      const seg = segundos % 60;

      return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
    }

    function tempoRelativo(timestamp) {
    // eslint-disable-next-line react-hooks/purity
    const segundos = Math.floor((Date.now() - timestamp) / 1000);

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

  return (
    <div style={s.page}>
      {/* Navbar */}
      <div style={s.navbar}>
        <span style={s.brand}>Fila Digital</span>
        {/* <div style={s.navLeft}>
          <nav style={s.tabs}>
            {["dashboard", "history", "queues"].map((t) => (
              <button
                key={t}
                style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
                onClick={() => setTab(t)}
              >
                {t === "dashboard" ? "Dashboard" : t === "history" ? "History" : "Queues"}
              </button>
            ))}
          </nav>
        </div>
        <div style={s.navRight}>
          <button style={s.btnNextTicket} onClick={chamar} disabled={loading || !fila?.ativa}>
            {loading ? "Chamando…" : "Next Ticket"}
          </button>
          <button style={s.iconBtn}>🔔</button>
          <button style={s.iconBtn}>⚙️</button>
          <div style={s.avatar}>AT</div>
        </div> */}
      </div>

      {/* Body */}
      <div style={s.body}>
        {/* Left column */}
        <div style={s.leftCol}>
          {/* Senha atual */}
          <div style={s.cardWhite}>
            <p style={s.sectionLabel}>SENHA ATUAL</p>
            <div style={{ ...s.senhaGrande, ...(animando ? s.senhaAnimando : {}) }}>
              {fila?.senhaAtual || "0000"}
            </div>
            <div style={s.guicheTag}>
              <span style={s.dot} />
              Guichê 04 • Ativo
            </div>
          </div>

          {/* Actions */}
          <div style={s.actionsRow}>
            <button
              style={{ ...s.btnProxima, opacity: loading || !fila?.ativa ? 0.6 : 1 }}
              onClick={chamar}
              disabled={loading || !fila?.ativa}
            >
              <div>
                <p style={s.btnLabel}>AÇÃO PRINCIPAL</p>
                <p style={s.btnTitle}>{loading ? "Chamando…" : "Próxima Senha"}</p>
              </div>
              <span style={s.arrowIcon}>›</span>
            </button>

            {confirmFinalizar ? (
              <div style={s.confirmCard}>
                <p style={s.confirmText}>Confirmar encerramento?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={s.btnSim} onClick={finalizar}>Sim, encerrar</button>
                  <button style={s.btnNao} onClick={() => setConfirmFinalizar(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button style={s.btnEncerrar} onClick={() => setConfirmFinalizar(true)}>
                <div>
                  <p style={s.btnLabel}>FIM DE TURNO</p>
                  <p style={s.encerrarTitle}>Encerrar Fila</p>
                </div>
                <span style={s.closeIcon}>✕</span>
              </button>
            )}
          </div>

          {/* Histórico */}
          <div>
            <div style={s.historicoHeader}>
              <p style={s.historicoTitle}>Últimos Atendimentos</p>
              <a href="#" style={s.verMais}>Ver histórico completo ↗</a>
            </div>
            <div style={s.historicoGrid}>
              {historico.length === 0 ? (
                <div style={s.semHistorico}>
                  Nenhuma senha foi chamada ainda
                </div>
              ) : (
                historico.slice(0, 6).map((h) => (
                  <div key={h.id} style={s.historicoCard}>
                    <p style={s.historicoSenha}>
                      {h.senha}
                    </p>

                    <p style={s.historicoStatus}>CHAMADA</p>

                    <p style={s.historicoTempo}>
                      {tempoRelativo(h.chamadaEm)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={s.rightCol}>
          {/* Em espera */}
          <div style={s.cardBeige}>
            <p style={s.cardBeigeLabel}>EM ESPERA</p>
            <p style={s.cardBeigeNum}>{aguardando}</p>
            <p style={s.cardBeigeSub}>Tempo médio de espera</p>
            <p style={s.cardBeigeTime}>
              {tempoRestante === 0
                ? "Sem espera"
                : formatarTempo(tempoRestante)}
            </p>
          </div>

          {/* Links */}
          <a href={painelUrl} target="_blank" rel="noreferrer" style={s.linkCard}>
            <span style={s.linkIcon}>🖥️</span>
            <span style={s.linkCardText}>Painel Público</span>
          </a>
          <a href={qrUrl} target="_blank" rel="noreferrer" style={s.linkCard}>
            <span style={s.linkIcon}>⊞</span>
            <span style={s.linkCardText}>QR Code</span>
          </a>

          {/* Status */}
          <div style={s.statusCard}>
            <p style={s.statusLabel}>STATUS DA FILA</p>
            <div style={s.statusRow}>
              <div style={{ ...s.statusDot, background: fila?.ativa !== false ? "#22c55e" : "#ef4444" }} />
              <span style={s.statusText}>{fila?.ativa !== false ? "Ativa" : "Encerrada"}</span>
            </div>
            <div style={s.statusMeta}>
              <div style={s.statItem}>
                <p style={s.statVal}>{fila?.ultimaSenhaGerada || 102}</p>
                <p style={s.statKey}>Última gerada</p>
              </div>
              <div style={s.statItem}>
                <p style={s.statVal}>{aguardando || 0}</p>
                <p style={s.statKey}>Aguardando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  semHistorico: {
    background: "#fff",
    border: "1px dashed #d6d3d1",
    borderRadius: 12,
    padding: "24px",
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
    gridColumn: "1 / -1"
  },

  page: {
    minHeight: "100vh",
    background: "#f5f4f0",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: "#1a1a1a",
  },

  /* Navbar */
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    height: 56,
    background: "#fff",
    borderBottom: "1px solid #e8e7e3",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  brand: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1a1a1a",
  },
  tabs: {
    display: "flex",
    gap: 4,
  },
  tab: {
    background: "none",
    border: "none",
    padding: "6px 14px",
    fontSize: "0.85rem",
    color: "#888",
    cursor: "pointer",
    borderRadius: 8,
    fontWeight: 500,
  },
  tabActive: {
    color: "#1a1a1a",
    background: "#f0efeb",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  btnNextTicket: {
    background: "#1a6ef5",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#d0d0c8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#555",
  },

  /* Body layout */
  body: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 20,
    padding: 24,
    maxWidth: 1000,
    margin: "0 auto",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  /* Senha atual card */
  cardWhite: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 32px",
    border: "1px solid #e8e7e3",
  },
  sectionLabel: {
    fontSize: "0.68rem",
    letterSpacing: "0.15em",
    color: "#aaa",
    fontWeight: 600,
    marginBottom: 12,
  },
  senhaGrande: {
    fontSize: "6rem",
    fontWeight: 900,
    lineHeight: 1,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
    marginBottom: 16,
    transition: "transform 0.3s ease",
  },
  senhaAnimando: {
    transform: "scale(1.06)",
  },
  guicheTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#e8f5ef",
    color: "#166534",
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },

  /* Action buttons row */
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  btnProxima: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1e6a3e",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "20px 22px",
    cursor: "pointer",
    textAlign: "left",
  },
  btnLabel: {
    fontSize: "0.62rem",
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.55)",
    marginBottom: 4,
    fontWeight: 600,
  },
  btnTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
  },
  arrowIcon: {
    fontSize: "2rem",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1,
  },
  btnEncerrar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #e8e7e3",
    borderRadius: 14,
    padding: "20px 22px",
    cursor: "pointer",
    textAlign: "left",
  },
  encerrarTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#e53e3e",
    margin: 0,
  },
  closeIcon: {
    fontSize: "1.1rem",
    color: "#e53e3e",
    border: "1.5px solid #fca5a5",
    borderRadius: "50%",
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCard: {
    background: "#fff",
    border: "1px solid #fca5a5",
    borderRadius: 14,
    padding: "20px 22px",
  },
  confirmText: {
    fontSize: "0.85rem",
    color: "#e53e3e",
    marginBottom: 12,
    fontWeight: 500,
  },
  btnSim: {
    flex: 1,
    padding: "9px",
    background: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  btnNao: {
    flex: 1,
    padding: "9px",
    background: "none",
    border: "1px solid #e8e7e3",
    borderRadius: 9,
    color: "#666",
    cursor: "pointer",
    fontSize: "0.85rem",
  },

  /* Histórico */
  historicoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historicoTitle: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1a1a1a",
  },
  verMais: {
    fontSize: "0.8rem",
    color: "#1a6ef5",
    textDecoration: "none",
    fontWeight: 500,
  },
  historicoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  historicoCard: {
    background: "#fff",
    border: "1px solid #e8e7e3",
    borderRadius: 12,
    padding: "14px 16px",
  },
  historicoSenha: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  historicoStatus: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "#22c55e",
    fontWeight: 600,
    marginBottom: 2,
  },
  historicoTempo: {
    fontSize: "0.78rem",
    color: "#aaa",
  },

  /* Right column cards */
  cardBeige: {
    background: "#faf7f0",
    border: "1px solid #e8e3d5",
    borderRadius: 14,
    padding: "20px 22px",
  },
  cardBeigeLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    color: "#b07d2a",
    fontWeight: 700,
    marginBottom: 6,
  },
  cardBeigeNum: {
    fontSize: "2.8rem",
    fontWeight: 900,
    color: "#b07d2a",
    lineHeight: 1,
    marginBottom: 10,
  },
  cardBeigeSub: {
    fontSize: "0.75rem",
    color: "#9a8060",
    marginBottom: 2,
  },
  cardBeigeTime: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#7a5c20",
  },
  linkCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    border: "1px solid #e8e7e3",
    borderRadius: 12,
    padding: "14px 18px",
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  linkIcon: {
    fontSize: "1.1rem",
  },
  linkCardText: {
    color: "#333",
  },
  statusCard: {
    background: "#fff",
    border: "1px solid #e8e7e3",
    borderRadius: 14,
    padding: "18px 20px",
    marginTop: 4,
  },
  statusLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    color: "#aaa",
    fontWeight: 600,
    marginBottom: 10,
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  statusMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    borderTop: "1px solid #f0efeb",
    paddingTop: 14,
  },
  statItem: {
    textAlign: "center",
  },
  statVal: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  statKey: {
    fontSize: "0.72rem",
    color: "#aaa",
    fontWeight: 500,
  },
};