import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { escutarFila, gerarSenha } from "../services/filaService";
import "./QRCodeFila.scss";

export default function QRCodeFila() {
  
  const { filaId } = useParams();
  const [nomeFila, setNomeFila] = useState("Fila Digital");
  const [filaAtiva, setFilaAtiva] = useState(true);
  const [senhaGerada, setSenhaGerada] = useState<number | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  const url = `${window.location.origin}/fila/${filaId}`;

  useEffect(() => {
    if (!filaId) return;

    return escutarFila(filaId, (fila) => {
      if (!fila) {
        setErro("Esta fila não foi encontrada.");
        setFilaAtiva(false);
        return;
      }

      setNomeFila(fila.nome || "Fila Digital");
      setFilaAtiva(fila.ativa !== false);
    });
  }, [filaId]);

  async function retirarSenha() {
    if (!filaId || !filaAtiva || gerando) return;

    setGerando(true);
    setErro("");

    try {
      const resultado = await gerarSenha(filaId);
      setSenhaGerada(resultado.numero);
      window.setTimeout(() => window.print(), 150);
    } catch {
      setErro("Não foi possível gerar a senha. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }

  function fecharComprovante() {
    setSenhaGerada(null);
    setErro("");
  }

  if (!filaId) {
    return <main className="totem-page"><section className="totem-panel"><p className="totem-error">Fila inválida.</p></section></main>;
  }

  return (
    <main className="totem-page">
      <section className="totem-panel" aria-labelledby="totem-title">
        <header className="totem-header">
          <div className="totem-mark" aria-hidden="true">
            <img src="/logo_sua_vez.png"  alt="Sua Vez" />
          </div>
          <div>
            <p className="totem-kicker">AUTOATENDIMENTO</p>
            <h1 id="totem-title">{nomeFila}</h1>
          </div>
        </header>

        <div className="totem-content">
          <section className="totem-qr-section" aria-label="Retirada pelo celular">
            <div className="totem-qr-frame">
              <QRCodeCanvas value={url} size={280} bgColor="#ffffff" fgColor="#102a43" includeMargin />
            </div>
            <p className="totem-step">01 <span>PELO CELULAR</span></p>
            <h2>Escaneie e retire sua senha</h2>
            <p className="totem-copy">Aponte a câmera do celular para o QR Code e acompanhe sua vez pelo telefone.</p>
          </section>

          <div className="totem-divider" aria-hidden="true"><span>ou</span></div>

          <section className="totem-print-section" aria-label="Retirada no totem">
            <p className="totem-step">02 <span>NO TOTEM</span></p>
            <h2>Prefere uma senha impressa?</h2>
            <p className="totem-copy">Toque no botão abaixo para gerar e imprimir sua senha.</p>
            <button className="totem-button" onClick={retirarSenha} disabled={gerando || !filaAtiva}>
              {gerando ? "Gerando senha..." : filaAtiva ? "IMPRIMIR SENHA" : "Fila encerrada"}
            </button>
            {erro && <p className="totem-feedback totem-feedback-error" role="alert">{erro}</p>}
          </section>
        </div>
      </section>

      {senhaGerada !== null && (
        <div className="ticket-overlay" role="dialog" aria-modal="true" aria-labelledby="ticket-title">
          <section className="ticket">
            <p className="ticket-label">SUA SENHA</p>
            <h2 id="ticket-title">{String(senhaGerada).padStart(3, "0")}</h2>
            <p>{nomeFila}</p>
            <span>Apresente esta senha quando for chamado.</span>
            <button className="ticket-close" onClick={fecharComprovante}>Concluir</button>
          </section>
        </div>
      )}
    </main>
  );

}