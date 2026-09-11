# SuaVez

## Aviso por SMS

Ao abrir o QR code, o cliente pode informar um celular brasileiro com DDD. O número é normalizado para +55 e salvo na senha, com autorização para o aviso. Deixar o campo vazio mantém a retirada sem SMS. Telefones não são gravados no localStorage nem nos documentos públicos da fila; as regras permitem leitura da senha apenas pelo próprio cliente e pelo dono da fila.

Quando `senhaAtual` avança, a Cloud Function `notificarChamada` envia exatamente **É SUA VEZ** pelo Twilio. O envio acontece no servidor, inclusive com o navegador do cliente fechado. Senhas antigas sem telefone, canceladas e filas encerradas não geram SMS.

### Configurar e publicar

1. Configure uma conta Twilio e um Messaging Service com remetente habilitado para enviar SMS ao Brasil. Verifique as permissões de destino; contas de teste têm restrições de destinatários.
2. Habilite o plano Blaze no projeto Firebase para publicar Cloud Functions. Firebase e Twilio podem gerar custos.
3. Instale as dependências: `npm --prefix functions install`.
4. Com o Firebase CLI instalado e autenticado, cadastre os segredos abaixo, substituindo `SEU_PROJETO` pelo ID do mesmo projeto usado no frontend:

```sh
firebase functions:secrets:set TWILIO_ACCOUNT_SID --project SEU_PROJETO
firebase functions:secrets:set TWILIO_AUTH_TOKEN --project SEU_PROJETO
firebase functions:secrets:set TWILIO_MESSAGING_SERVICE_SID --project SEU_PROJETO
firebase deploy --only firestore:rules,functions:notificarChamada --project SEU_PROJETO
```

Nunca coloque credenciais Twilio em variáveis `VITE_*`. Publique também o frontend atualizado (`npm run build`) no serviço de hospedagem usado pelo projeto. O QR code continua com a mesma URL.

### Verificar

Execute `node --test tests/sms.test.js`, `npm run lint` e `npm run build`. Para validar a integração publicada, retire uma senha com um celular autorizado, chame pelo painel e confira o SMS e o registro privado `filas/{filaId}/notificacoesSms/{senhaId}` no console Firebase. Confira também a retirada sem telefone e o cancelamento antes da chamada.

O registro de envio é reservado em transação antes de acessar o Twilio, impedindo novas tentativas automáticas para a mesma senha. `aceito` significa que o provedor aceitou a mensagem, não que ela foi entregue. `falha_ou_indeterminado` indica erro ou falta de confirmação; `processando` pode permanecer após uma interrupção. Consulte o Twilio antes de qualquer reenvio manual: uma falha de rede pode acontecer após o provedor aceitar a mensagem. Essa escolha evita duplicação, mas pode perder um aviso se a função parar entre a reserva e o envio. Não há confirmação de entrega ou reenvio automático nesta implementação.

Referências: [eventos Firestore](https://firebase.google.com/docs/functions/firestore-events), [API de SMS Twilio](https://www.twilio.com/docs/messaging/api/message-resource), [publicação de funções Firebase](https://firebase.google.com/docs/functions/get-started).
