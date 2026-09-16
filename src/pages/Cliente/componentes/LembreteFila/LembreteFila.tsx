import { useEffect, useRef } from "react";
import "./LembreteFila.styles.scss";

// 5 minutos
const INTERVALO = 5 * 60 * 1000;

// TESTE: 10 segundos
//const INTERVALO = 10 * 1000

interface Props {
  identificador: string;
  senha: number;
  confirmando: boolean;
  onSair: () => void;
}

export default function LembreteFila({ identificador, senha, confirmando, onSair }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const proximoAviso = useRef(0);
  const chave = `fila-digital:lembrete:${identificador}`;

  function adiar() {
    proximoAviso.current = Date.now() + INTERVALO;
    try {
      localStorage.setItem(chave, String(proximoAviso.current));
    } catch {
      // O lembrete continua funcionando se o navegador bloquear o armazenamento.
    }
    dialogRef.current?.close();
  }

  useEffect(() => {
    let armazenado = 0;
    try {
      armazenado = Number(localStorage.getItem(chave));
    } catch {
      // Usa o relógio desta sessão quando o armazenamento não está disponível.
    }
    proximoAviso.current = Number.isFinite(armazenado) && armazenado > 0
      ? armazenado
      : Date.now() + INTERVALO;
    try {
      localStorage.setItem(chave, String(proximoAviso.current));
    } catch {
      // O armazenamento é opcional.
    }
  }, [chave]);

  useEffect(() => {
    const dialog = dialogRef.current;
    function verificar() {
      if (!confirmando && document.visibilityState === "visible"
        && Date.now() >= proximoAviso.current && dialog && !dialog.open) {
        dialog.showModal();
      }
    }
    verificar();
    const timer = window.setInterval(verificar, 1000);
    document.addEventListener("visibilitychange", verificar);
    window.addEventListener("pageshow", verificar);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", verificar);
      window.removeEventListener("pageshow", verificar);
      dialog?.close();
    };
  }, [chave, confirmando]);

  return (
    <dialog
      ref={dialogRef}
      className="lembrete-fila"
      aria-labelledby="lembrete-fila-titulo"
      aria-describedby="lembrete-fila-descricao"
      onCancel={(event) => { event.preventDefault(); adiar(); }}
    >
      <h2 id="lembrete-fila-titulo">Você ainda está na fila</h2>
      <p id="lembrete-fila-descricao">
        Sua senha é <strong>{senha}</strong>. Ainda está aguardando atendimento?
        Se não precisar mais, saia da fila para liberar sua vez.
      </p>
      <div className="lembrete-fila-acoes">
        <button autoFocus className="lembrete-fila-continuar" onClick={adiar}>
          Continuar na fila
        </button>
        <button className="lembrete-fila-sair" onClick={() => { adiar(); onSair(); }}>
          Sair da fila
        </button>
      </div>
    </dialog>
  );
}
