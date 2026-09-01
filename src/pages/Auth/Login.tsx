import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import "./Auth.styles.scss";

function mensagemErro(codigo?: string) {
  const mensagens: Record<string, string> = {
    "auth/invalid-credential": "E-mail ou senha inválidos.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/wrong-password": "E-mail ou senha inválidos.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns instantes e tente novamente.",
  };
  return mensagens[codigo ?? ""] ?? "Não foi possível entrar. Tente novamente.";
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await login(email.trim(), senha);
      const destino = (location.state as { de?: string } | null)?.de || "/";
      navigate(destino, { replace: true });
    } catch (erro: unknown) {
      console.error("Erro completo:", erro);
      setErro(mensagemErro((erro as { code?: string }).code));
    } finally {
      setEnviando(false);
    }
  }

  return <main className="auth-page"><section className="auth-card">
    <p className="auth-tag">FILA DIGITAL</p><h1 className="auth-title">Entrar</h1><p className="auth-copy">Acesse o ambiente administrativo.</p>
    <form className="auth-form" onSubmit={entrar}>
      <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
      <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" /></label>
      {erro && <p className="auth-error" role="alert">{erro}</p>}
      <button className="auth-submit" disabled={enviando}>{enviando ? "Entrando..." : "Entrar"}</button>
    </form>
    <p className="auth-footer">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
  </section></main>;
}
