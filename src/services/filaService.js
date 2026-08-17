import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  doc,
  collection,
  runTransaction,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  where
} from "firebase/firestore";

export async function criarFila(nome) {
  const filaRef = await addDoc(collection(db, "filas"), {
    nome: nome,
    senhaAtual: 0,
    ultimaSenhaGerada: 0,
    ativa: true,
    criadaEm: new Date()
  });
  return filaRef.id;
}

export async function gerarSenha(filaId) {
  const filaRef = doc(db, "filas", filaId);

  const resultado = await runTransaction(db, async (transaction) => {
    const filaDoc = await transaction.get(filaRef);
    const dados = filaDoc.data();
    const ultimo = dados.ultimaSenhaGerada || 0;
    const proxima = ultimo + 1;

    const senhaRef = doc(collection(db, "filas", filaId, "senhas"));

    transaction.set(senhaRef, {
      numero: proxima,
      cancelada: false,
      criadaEm: new Date()
    });

    transaction.update(filaRef, {
      ultimaSenhaGerada: proxima
    });

    return { numero: proxima, senhaDocId: senhaRef.id };
  });

  return resultado;
}

export async function cancelarSenha(filaId, senhaDocId) {
  const senhaRef = doc(db, "filas", filaId, "senhas", senhaDocId);
  await updateDoc(senhaRef, { cancelada: true });
}

export async function getPosicaoNaFila(filaId, meuNumero) {
  const senhasRef = collection(db, "filas", filaId, "senhas");
  const q = query(senhasRef, orderBy("numero"));
  const snapshot = await getDocs(q);

  let posicao = 0;
  snapshot.forEach((doc) => {
    const s = doc.data();
    if (!s.cancelada && s.numero < meuNumero) {
      posicao++;
    }
  });

  return posicao; // quantas senhas ativas ainda estão na frente
}

export function escutarSenha(filaId, senhaDocId, callback) {
  const senhaRef = doc(db, "filas", filaId, "senhas", senhaDocId);
  return onSnapshot(senhaRef, (snap) => {
    callback(snap.data());
  });
}

export function escutarFila(filaId, callback) {
  const filaRef = doc(db, "filas", filaId);
  return onSnapshot(filaRef, (snap) => {
    const dados = snap.data();
    callback(dados ? { ...dados, id: filaId } : null);
  });
}

export function escutarFilaAtiva(callback) {
  const unsub = escutarFilasAtivas((filas) => {
    callback(filas[0] || null);
  });

  return unsub;
}

export function escutarFilasAtivas(callback) {
  const filasRef = collection(db, "filas");
  const q = query(filasRef, where("ativa", "==", true));

  return onSnapshot(q, (snapshot) => {
    const filas = [];

    snapshot.forEach((doc) => {
      filas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    filas.sort((a, b) => {
      const criadaEmA = a.criadaEm?.toMillis ? a.criadaEm.toMillis() : 0;
      const criadaEmB = b.criadaEm?.toMillis ? b.criadaEm.toMillis() : 0;

      return criadaEmB - criadaEmA;
    });

    callback(filas);
  });
}

export async function chamarProximaSenha(filaId) {
  const filaRef = doc(db, "filas", filaId);

  await runTransaction(db, async (transaction) => {
    const filaDoc = await transaction.get(filaRef);
    const dados = filaDoc.data();
    let senhaAtual = dados.senhaAtual || 0;

    const senhasRef = collection(db, "filas", filaId, "senhas");
    const q = query(senhasRef, orderBy("numero"));
    const snapshot = await getDocs(q);

    let proxima = null;

    snapshot.forEach((doc) => {
      const senha = doc.data();
      if (senha.numero > senhaAtual && senha.cancelada !== true && proxima === null) {
        proxima = senha.numero;
      }
    });

    if (proxima !== null) {
      const agora = Date.now();

      transaction.update(filaRef, {
        senhaAtual: proxima,
        ultimaChamadaEm: agora
      });

      const historicoRef = doc(
        collection(db, "filas", filaId, "historico")
      );

      transaction.set(historicoRef, {
        senha: proxima,
        chamadaEm: agora
      });
    }
  });
}

export function escutarHistorico(filaId, callback) {
  const historicoRef = collection(db, "filas", filaId, "historico");

  const q = query(historicoRef, orderBy("chamadaEm", "desc"));

  return onSnapshot(q, (snapshot) => {
    const dados = [];

    snapshot.forEach((doc) => {
      dados.push({
        id: doc.id,
        ...doc.data()
      });
    });

    callback(dados);
  });
}

export async function finalizarFila(filaId) {
  const filaRef = doc(db, "filas", filaId);
  await updateDoc(filaRef, { ativa: false });
}

export function escutarPosicaoNaFila(filaId, meuNumero, callback) {
  const senhasRef = collection(db, "filas", filaId, "senhas");
  const q = query(senhasRef, orderBy("numero"));

  return onSnapshot(q, (snapshot) => {
    let posicao = 0;
    snapshot.forEach((doc) => {
      const s = doc.data();
      if (!s.cancelada && s.numero < meuNumero) {
        posicao++;
      }
    });
    callback(posicao);
  });
}