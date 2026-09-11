import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { enviarSms } from "./sms.js";

initializeApp();
const db = getFirestore();
const accountSid = defineSecret("TWILIO_ACCOUNT_SID");
const authToken = defineSecret("TWILIO_AUTH_TOKEN");
const serviceSid = defineSecret("TWILIO_MESSAGING_SERVICE_SID");

export const notificarChamada = onDocumentUpdated({
  document: "filas/{filaId}",
  secrets: [accountSid, authToken, serviceSid],
  retry: true,
}, async (event) => {
  const antes = event.data.before.data();
  const depois = event.data.after.data();
  if (!depois.ativa || !(depois.senhaAtual > (antes.senhaAtual || 0))) return;
  const filaRef = event.data.after.ref;
  const senhas = await filaRef.collection("senhas")
    .where("numero", "==", depois.senhaAtual).limit(2).get();
  // Não envie para destinatários ambíguos caso existam números duplicados.
  if (senhas.size !== 1) return;
  const senhaRef = senhas.docs[0].ref;
  const envioRef = filaRef.collection("notificacoesSms").doc(senhaRef.id);
  const telefone = await db.runTransaction(async (transaction) => {
    const [envio, senha, fila] = await Promise.all([
      transaction.get(envioRef), transaction.get(senhaRef), transaction.get(filaRef),
    ]);
    const dados = senha.data();
    if (envio.exists || !fila.data()?.ativa || fila.data().senhaAtual !== depois.senhaAtual
      || dados?.cancelada || dados?.aceitaSms !== true
      || !/^[+]55[1-9]{2}9\d{8}$/.test(dados?.telefone || "")) return null;
    // Reserva antes da chamada externa: prioriza não duplicar cobranças e avisos.
    transaction.create(envioRef, { status: "processando", criadaEm: FieldValue.serverTimestamp() });
    return dados.telefone;
  });
  if (!telefone) return;
  let resultado;
  try {
    resultado = await enviarSms({
      telefone, accountSid: accountSid.value(), authToken: authToken.value(),
      serviceSid: serviceSid.value(),
    });
  } catch {
    // Não registramos telefone, credenciais ou respostas do provedor nos logs.
    await envioRef.update({ status: "falha_ou_indeterminado", atualizadaEm: FieldValue.serverTimestamp() });
    return;
  }
  await envioRef.update({ status: "aceito", messageSid: resultado.sid, atualizadaEm: FieldValue.serverTimestamp() });
});
