import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  chamarProximaSenha,
  escutarFila,
  escutarHistorico,
  finalizarFila,
} from "../../services/filaService";

interface Fila {
  ativa?: boolean;
  senhaAtual?: number;
  ultimaSenhaGerada?: number;
  ultimaChamadaEm?: number;
}

interface HistoricoItem {
  id?: string;
  senha?: number;
  chamadaEm?: number;
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f4f8ff 0%, #e8f0ff 100%)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: "#0f172a",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 28px",
    height: 56,
    background: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid #dbe3f0",
  },
  brand: { fontWeight: 700, fontSize: "1rem", color: "#2563eb" },
  body: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 20,
    padding: 24,
    maxWidth: 1000,
    margin: "0 auto",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { display: "flex", flexDirection: "column", gap: 12 },
  cardWhite: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 32px",
    border: "1px solid #dbe3f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
  },
  sectionLabel: {
    fontSize: "0.68rem",
    letterSpacing: "0.15em",
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 12,
  },
  senhaGrande: {
    fontSize: "6rem",
    fontWeight: 900,
    lineHeight: 1,
    color: "#2563eb",
    letterSpacing: "-0.02em",
    marginBottom: 16,
    transition: "transform 0.3s ease",
  },
  senhaAnimando: { transform: "scale(1.06)" },
  guicheTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#e8f0ff",
    color: "#1d4ed8",
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
  actionsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  btnProxima: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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
  btnTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#fff", margin: 0 },
  arrowIcon: { fontSize: "2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1 },
  btnEncerrar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #dbe3f0",
    borderRadius: 14,
    padding: "20px 22px",
    cursor: "pointer",
    textAlign: "left",
  },
  encerrarTitle: { fontSize: "1.1rem", fontWeight: 700, color: "#dc2626", margin: 0 },
  closeIcon: {
    fontSize: "1.1rem",
    color: "#dc2626",
    border: "1.5px solid #fecaca",
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
  confirmText: { fontSize: "0.85rem", color: "#e53e3e", marginBottom: 12, fontWeight: 500 },
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
  historicoHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  historicoTitle: { fontWeight: 700, fontSize: "1rem", color: "#1a1a1a" },
  verMais: { fontSize: "0.8rem", color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  historicoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  historicoCard: {
    background: "#fff",
    border: "1px solid #dbe3f0",
    borderRadius: 12,
    padding: "14px 16px",
  },
  historicoSenha: { fontWeight: 700, fontSize: "1rem", color: "#1a1a1a", marginBottom: 4 },
  historicoStatus: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    color: "#22c55e",
    fontWeight: 600,
    marginBottom: 2,
  },
  historicoTempo: { fontSize: "0.78rem", color: "#aaa" },
  cardBeige: {
    background: "#f8fbff",
    border: "1px solid #dbe3f0",
    borderRadius: 14,
    padding: "20px 22px",
  },
  cardBeigeLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    color: "#2563eb",
    fontWeight: 700,
    marginBottom: 6,
  },
  cardBeigeNum: { fontSize: "2.8rem", fontWeight: 900, color: "#2563eb", lineHeight: 1, marginBottom: 10 },
  cardBeigeSub: { fontSize: "0.75rem", color: "#64748b", marginBottom: 2 },
  cardBeigeTime: { fontSize: "1rem", fontWeight: 700, color: "#1d4ed8" },
  linkCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    border: "1px solid #dbe3f0",
    borderRadius: 12,
    padding: "14px 18px",
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    fontSize: "0.85rem",
  },
  linkIcon: { fontSize: "1.1rem" },
  linkCardText: { color: "#333" },
  statusCard: {
    background: "#fff",
    border: "1px solid #dbe3f0",
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
  statusRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  statusDot: { width: 9, height: 9, borderRadius: "50%" },
  statusText: { fontSize: "0.85rem", fontWeight: 600, color: "#1a1a1a" },
  statusMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    borderTop: "1px solid #f0efeb",
    paddingTop: 14,
  },
  statItem: { textAlign: "center" },
  statVal: { fontSize: "1.5rem", fontWeight: 800, color: "#1a1a1a", marginBottom: 2 },
  statKey: { fontSize: "0.72rem", color: "#aaa", fontWeight: 500 },
  semHistorico: {
    background: "#fff",
    border: "1px dashed #d6d3d1",
    borderRadius: 12,
    padding: "24px",
    textAlign: "center",
    color: "#888",
    fontSize: "0.9rem",
    gridColumn: "1 / -1",
  },
};

export default function Atendente() {
  const { filaId } = useParams<{ filaId?: string }>();
  const navigate = useNavigate();

  const [fila, setFila] = useState<Fila | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);
  const [animando, setAnimando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    if (!filaId) {
      setFila(null);
      return;
    }

    const unsub = escutarFila(filaId, (dados: Fila | null) => {
      setFila(dados ?? null);
    });

    return () => unsub();
  }, [filaId]);

  useEffect(() => {
    if (!filaId) return;

    const aguardando = Math.max(0, (fila?.ultimaSenhaGerada ?? 0) - (fila?.senhaAtual ?? 0));

    if (aguardando <= 0) {
      setTempoRestante(0);
      return;
    }

    const ultimaChamada = fila?.ultimaChamadaEm ?? 0;

    if (ultimaChamada === 0) {
      setTempoRestante(300);
      return;
    }

    const atualizarTempo = () => {
      const agora = Date.now();
      const segundosPassados = Math.floor((agora - ultimaChamada) / 1000);
      const restante = Math.max(300 - segundosPassados, 0);
      setTempoRestante(restante);
    };

    atualizarTempo();
    const interval = setInterval(atualizarTempo, 1000);

    return () => clearInterval(interval);
  }, [fila, filaId]);

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

  const qrUrl = filaId ? `${window.location.origin}/qr/${filaId}` : "";
  const painelUrl = `${window.location.origin}/painel`;
  const aguardando = Math.max(0, (fila?.ultimaSenhaGerada ?? 0) - (fila?.senhaAtual ?? 0));

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

  function formatarTempo(segundos: number) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
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

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Fila Digital</span>
      </div>

      <div style={styles.body}>
        <div style={styles.leftCol}>
          <div style={styles.cardWhite}>
            <p style={styles.sectionLabel}>SENHA ATUAL</p>
            <div style={{ ...styles.senhaGrande, ...(animando ? styles.senhaAnimando : {}) }}>
              {fila?.senhaAtual ?? "0000"}
            </div>
            <div style={styles.guicheTag}>
              <span style={styles.dot} />
              Guichê 04 • Ativo
            </div>
          </div>

          <div style={styles.actionsRow}>
            <button
              style={{ ...styles.btnProxima, opacity: loading || !fila?.ativa ? 0.6 : 1 }}
              onClick={chamar}
              disabled={loading || !fila?.ativa}
            >
              <div>
                <p style={styles.btnLabel}>AÇÃO PRINCIPAL</p>
                <p style={styles.btnTitle}>{loading ? "Chamando…" : "Próxima Senha"}</p>
              </div>
              <span style={styles.arrowIcon}>›</span>
            </button>

            {confirmFinalizar ? (
              <div style={styles.confirmCard}>
                <p style={styles.confirmText}>Confirmar encerramento?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.btnSim} onClick={finalizar}>Sim, encerrar</button>
                  <button style={styles.btnNao} onClick={() => setConfirmFinalizar(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button style={styles.btnEncerrar} onClick={() => setConfirmFinalizar(true)}>
                <div>
                  <p style={styles.btnLabel}>FIM DE TURNO</p>
                  <p style={styles.encerrarTitle}>Encerrar Fila</p>
                </div>
                <span style={styles.closeIcon}>✕</span>
              </button>
            )}
          </div>

          <div>
            <div style={styles.historicoHeader}>
              <p style={styles.historicoTitle}>Últimos Atendimentos</p>
              <a href="#" style={styles.verMais}>Ver histórico completo ↗</a>
            </div>
            <div style={styles.historicoGrid}>
              {historico.length === 0 ? (
                <div style={styles.semHistorico}>Nenhuma senha foi chamada ainda</div>
              ) : (
                historico.slice(0, 6).map((h) => (
                  <div
                    key={h.id ?? `${h.senha ?? "senha"}-${h.chamadaEm ?? 0}`}
                    style={styles.historicoCard}
                  >
                    <p style={styles.historicoSenha}>{h.senha ?? 0}</p>
                    <p style={styles.historicoStatus}>CHAMADA</p>
                    <p style={styles.historicoTempo}>{tempoRelativo(h.chamadaEm ?? Date.now())}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.cardBeige}>
            <p style={styles.cardBeigeLabel}>EM ESPERA</p>
            <p style={styles.cardBeigeNum}>{aguardando}</p>
            <p style={styles.cardBeigeSub}>Tempo médio de espera</p>
            <p style={styles.cardBeigeTime}>
              {tempoRestante === 0 ? "Sem espera" : formatarTempo(tempoRestante)}
            </p>
          </div>

          <a href={painelUrl} target="_blank" rel="noreferrer" style={styles.linkCard}>
            <span style={styles.linkIcon}>🖥️</span>
            <span style={styles.linkCardText}>Painel Público</span>
          </a>
          <a href={qrUrl} target="_blank" rel="noreferrer" style={styles.linkCard}>
            <span style={styles.linkIcon}>⊞</span>
            <span style={styles.linkCardText}>QR Code</span>
          </a>

          <div style={styles.statusCard}>
            <p style={styles.statusLabel}>STATUS DA FILA</p>
            <div style={styles.statusRow}>
              <div
                style={{
                  ...styles.statusDot,
                  background: fila?.ativa !== false ? "#22c55e" : "#ef4444",
                }}
              />
              <span style={styles.statusText}>{fila?.ativa !== false ? "Ativa" : "Encerrada"}</span>
            </div>

            <div style={styles.statusMeta}>
              <div style={styles.statItem}>
                <p style={styles.statVal}>{fila?.ultimaSenhaGerada ?? 102}</p>
                <p style={styles.statKey}>Última gerada</p>
              </div>
              <div style={styles.statItem}>
                <p style={styles.statVal}>{aguardando || 0}</p>
                <p style={styles.statKey}>Aguardando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
