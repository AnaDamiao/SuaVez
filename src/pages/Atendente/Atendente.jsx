import { chamarProximaSenha, finalizarFila, escutarFila } from "../../services/filaService";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Atendente() {
  const { filaId } = useParams();
  const navigate = useNavigate();

  const [fila, setFila] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const unsub = escutarFila(filaId, setFila);
    return () => unsub();
  }, [filaId]);

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

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.headerLabel}>PAINEL DO ATENDENTE</p>
          <h1 style={styles.headerTitle}>{fila?.nome || "Fila"}</h1>
        </div>
        <div style={{ ...styles.badge, background: fila?.ativa ? "#1a3a2a" : "#3a1a1a", borderColor: fila?.ativa ? "#2d6a4a" : "#6a2d2d" }}>
          <span style={{ background: fila?.ativa ? "#2ecc71" : "#e74c3c", width: 8, height: 8, borderRadius: "50%", display: "inline-block", marginRight: 6 }} />
          <span style={{ color: fila?.ativa ? "#2ecc71" : "#e74c3c", fontSize: "0.8rem", fontWeight: 600 }}>
            {fila?.ativa ? "Ativa" : "Encerrada"}
          </span>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Senha atual */}
        <div style={styles.card}>
          <p style={styles.cardLabel}>SENHA ATUAL</p>
          <div style={{ ...styles.senhaGrande, ...(animando ? styles.senhaAnimando : {}) }}>
            {fila?.senhaAtual || "—"}
          </div>
          <p style={styles.cardSub}>
            Última gerada: <strong>{fila?.ultimaSenhaGerada || 0}</strong>
          </p>
          <p style={styles.cardSub}>
            Na fila: <strong>{Math.max(0, (fila?.ultimaSenhaGerada || 0) - (fila?.senhaAtual || 0))}</strong> aguardando
          </p>
        </div>

        {/* Ações */}
        <div style={styles.card}>
          <p style={styles.cardLabel}>AÇÕES</p>

          <button
            style={{ ...styles.btnChamar, opacity: loading || !fila?.ativa ? 0.5 : 1 }}
            onClick={chamar}
            disabled={loading || !fila?.ativa}
          >
            {loading ? "Chamando…" : "▶ Chamar próximo"}
          </button>

          <div style={styles.linkGroup}>
            <a href={qrUrl} target="_blank" rel="noreferrer" style={styles.link}>
              🔗 Ver QR Code da fila
            </a>
            <a href={painelUrl} target="_blank" rel="noreferrer" style={styles.link}>
              📺 Abrir painel público
            </a>
          </div>

          <div style={styles.separator} />

          {confirmFinalizar ? (
            <div style={styles.confirmBox}>
              <p style={{ margin: "0 0 12px", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                Confirmar encerramento da fila?
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={styles.btnDanger} onClick={finalizar}>Sim, encerrar</button>
                <button style={styles.btnSecondary} onClick={() => setConfirmFinalizar(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button style={styles.btnSecondary} onClick={() => setConfirmFinalizar(true)}>
              Finalizar fila
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "32px 24px",
    color: "#fff",
    maxWidth: "700px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: 12,
  },
  headerLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "4px",
    fontWeight: 600,
  },
  headerTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    margin: 0,
  },
  badge: {
    border: "1px solid",
    borderRadius: "20px",
    padding: "6px 14px",
    display: "flex",
    alignItems: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "20px",
    padding: "28px 24px",
  },
  cardLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.3)",
    marginBottom: "16px",
    fontWeight: 600,
  },
  cardSub: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.45)",
    margin: "6px 0 0",
  },
  senhaGrande: {
    fontSize: "5.5rem",
    fontWeight: 900,
    lineHeight: 1,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px",
    transition: "transform 0.3s ease",
  },
  senhaAnimando: {
    transform: "scale(1.1)",
  },
  btnChamar: {
    width: "100%",
    padding: "16px",
    fontSize: "1rem",
    fontWeight: 700,
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "16px",
    letterSpacing: "0.03em",
  },
  linkGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: "16px",
  },
  link: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.85rem",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    transition: "background 0.2s",
  },
  separator: {
    height: "1px",
    background: "#2a2a2a",
    margin: "4px 0 16px",
  },
  btnSecondary: {
    width: "100%",
    padding: "12px",
    fontSize: "0.9rem",
    fontWeight: 600,
    border: "1px solid #333",
    borderRadius: "12px",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    cursor: "pointer",
  },
  btnDanger: {
    flex: 1,
    padding: "11px",
    fontSize: "0.9rem",
    fontWeight: 700,
    border: "none",
    borderRadius: "11px",
    background: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
  },
  confirmBox: {
    background: "rgba(231,76,60,0.1)",
    border: "1px solid rgba(231,76,60,0.25)",
    borderRadius: "12px",
    padding: "16px",
  },
};