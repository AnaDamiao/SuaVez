import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import "./Auth.styles.scss";

function mensagemErro(codigo?: string) {
  const mensagens: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
    "auth/invalid-email": "Informe um e-mail válido.",
  };
  return mensagens[codigo ?? ""] ?? "Não foi possível concluir o cadastro. Tente novamente.";
}

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState(""); const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState(""); const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault(); setErro("");
    if (senha !== confirmacao) { setErro("As senhas não coincidem."); return; }
    setEnviando(true);
    try { await cadastrar(email.trim(), senha, nome.trim()); navigate("/", { replace: true }); }
    catch (erro: unknown) { console.error("Erro completo:", erro); setErro(mensagemErro((erro as { code?: string }).code)); }
    finally { setEnviando(false); }
  }

  return <main className="auth-page"><section className="auth-card">
    <p className="auth-tag">FILA DIGITAL</p><h1 className="auth-title">Criar conta</h1><p className="auth-copy">Cadastre o administrador da fila.</p>
    <form className="auth-form" onSubmit={enviar}>
      <label>Nome<input value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" /></label>
      <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} autoComplete="new-password" /></label>
      <label>Confirmar senha<input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required autoComplete="new-password" /></label>
      {erro && <p className="auth-error" role="alert">{erro}</p>}
      <button className="auth-submit" disabled={enviando}>{enviando ? "Cadastrando..." : "Cadastrar"}</button>
    </form>
    <p className="auth-footer">Já possui conta? <Link to="/login">Entrar</Link></p>
  </section></main>;
}
