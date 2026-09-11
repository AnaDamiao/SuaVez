import { Buffer } from "node:buffer";

export async function enviarSms({ telefone, accountSid, authToken, serviceSid }) {
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: telefone, MessagingServiceSid: serviceSid, Body: "É SUA VEZ" }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("O provedor não confirmou o SMS.");
  const result = await response.json();
  if (!result.sid) throw new Error("Resposta do provedor sem identificador.");
  return { sid: result.sid };
}
