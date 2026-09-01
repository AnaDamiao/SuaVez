import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

interface AuthContextoValor {
  usuario: User | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (email: string, senha: string, nome: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextoValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (usuarioAtual) => {
    setUsuario(usuarioAtual);
    setCarregando(false);
  }), []);

  async function login(email: string, senha: string) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function cadastrar(email: string, senha: string, nome: string) {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha);

    try {
      await setDoc(doc(db, "usuarios", credencial.user.uid), {
        nome,
        email,
        role: "atendente",
        criadoEm: serverTimestamp(),
      });
    } catch (erro) {
      await signOut(auth);
      throw erro;
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return contexto;
}
