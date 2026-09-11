import test from "node:test";
import assert from "node:assert/strict";
import { normalizarCelular } from "../src/services/telefone.js";
import { enviarSms } from "../functions/sms.js";

test("normaliza celulares brasileiros e mantém entrada sem SMS", () => {
  assert.equal(normalizarCelular(" (11) 99999-1234 "), "+5511999991234");
  assert.equal(normalizarCelular("+55 11 99999-1234"), "+5511999991234");
  assert.equal(normalizarCelular(""), null);
  for (const telefone of ["999991234", "(11) 3333-1234", "+1 212 555 1234", "abc11999991234"]) {
    assert.throws(() => normalizarCelular(telefone));
  }
});

test("envia a frase exata e identifica aceitação ou erro do provedor", async (t) => {
  const opcoes = { telefone: "+5511999991234", accountSid: "ACteste", authToken: "segredo", serviceSid: "MGteste" };
  t.mock.method(globalThis, "fetch", async (url, request) => {
    assert.equal(url, "https://api.twilio.com/2010-04-01/Accounts/ACteste/Messages.json");
    assert.equal(request.method, "POST");
    assert.equal(request.body.get("Body"), "É SUA VEZ");
    assert.equal(request.body.get("To"), opcoes.telefone);
    assert.equal(request.body.get("MessagingServiceSid"), opcoes.serviceSid);
    return { ok: true, json: async () => ({ sid: "SMteste" }) };
  });
  assert.deepEqual(await enviarSms(opcoes), { sid: "SMteste" });
  globalThis.fetch.mock.mockImplementation(async () => ({ ok: false }));
  await assert.rejects(enviarSms(opcoes));
  globalThis.fetch.mock.mockImplementation(async () => { throw new Error("Timeout"); });
  await assert.rejects(enviarSms(opcoes));
});
