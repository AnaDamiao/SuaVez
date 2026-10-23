# SuaVez — Fila Digital

![React 19.2.4](https://img.shields.io/badge/React-19.2.4-149eca?logo=react)
![Firebase 12.10.0](https://img.shields.io/badge/Firebase-12.10.0-dd2c00?logo=firebase)
![Vite 7.3.1](https://img.shields.io/badge/Vite-7.3.1-646cff?logo=vite)
![TypeScript 7.0.2](https://img.shields.io/badge/TypeScript-7.0.2-3178c6?logo=typescript)
![Versão do projeto](https://img.shields.io/badge/vers%C3%A3o-0.0.0-lightgrey)
![Testes](https://img.shields.io/badge/su%C3%ADte_de_testes-n%C3%A3o_configurada-orange)

Aplicação web para organizar atendimento por senhas, com acompanhamento pelo celular, administração de filas, painel de chamadas e totem com QR Code e impressão. Construída em React, utiliza Firebase Authentication e Cloud Firestore diretamente no navegador.

O responsável cria uma fila; os clientes retiram senhas, acompanham quantas pessoas estão à frente e recebem uma estimativa de espera. O atendente chama a próxima senha válida e pode encerrar a fila. Os dados chegam às telas por listeners do Firestore.

**Estado documentado:** versão `0.0.0`, auditada em 21/09/2026. Os badges informam versões do lockfile e não representam CI ou certificação de qualidade. Há limitações de integridade nas regras de emissão e ausência de testes automatizados de integração; consulte [Segurança](#segurança) e [Problemas conhecidos](#problemas-conhecidos).

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias e versões](#tecnologias-e-versões)
- [Arquitetura](#arquitetura)
- [Modelo de dados](#modelo-de-dados)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Guia de uso](#guia-de-uso)
- [Rotas e API](#rotas-e-api)
- [Regras de negócio](#regras-de-negócio)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Testes e verificações](#testes-e-verificações)
- [Problemas conhecidos](#problemas-conhecidos)
- [Roadmap](#roadmap)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Documentação técnica e TCC](#documentação-técnica-e-tcc)

## Funcionalidades

### Administração

- Cadastro de atendente com nome, e-mail, senha e confirmação.
- Login, restauração de sessão e logout.
- Criação de múltiplas filas com nome próprio ou padrão `Fila principal`.
- Listagem das filas ativas do usuário, da mais recente para a mais antiga.
- Acesso ao atendimento de cada fila pelo ID.
- Chamada da próxima senha em ordem numérica, ignorando canceladas.
- Exibição da senha atual, última emitida e quantidade aguardando.
- Registro das chamadas e exibição das seis mais recentes.
- Encerramento de fila mediante confirmação.
- Atalhos para painel e totem.

### Cliente

- Acesso público por `/fila/:codigo`, sem formulário de cadastro.
- Identidade anônima Firebase quando não há usuário conectado.
- Emissão sequencial de senha no fluxo transacional do serviço.
- Atualização da senha atual e das pessoas à frente em tempo real.
- Recuperação da referência da senha após recarregar no mesmo navegador.
- Estimativa com contador, faixa de minutos e indicação de atraso.
- Confirmação antes do cancelamento.
- Telas de espera, chamada, cancelamento e fila encerrada.
- Retorno à entrada depois que a chamada ultrapassa o número do cliente.
- Lembrete a cada cinco minutos enquanto aguarda; é possível continuar ou iniciar a saída.

### Painel e totem

- Painel autenticado da fila pessoal ativa mais recente ou de um ID específico.
- Indicação de fila inativa e animação de atualização no painel.
- QR Code com link da fila, gerado localmente em canvas.
- Retirada pelo totem e abertura do diálogo de impressão do navegador.
- Comprovante com número de pelo menos três dígitos e nome da fila.
- Estilos de impressão com ticket de largura 72 mm.

**Limites funcionais:** o painel chamado “Público” na interface exige login. Não há prioridade, múltiplos guichês modelados, rechamada, conclusão individual do atendimento, notificações push, som, SMS, relatórios exportáveis ou reabertura de fila. “Configurações” e “Ver histórico completo” são links sem implementação. “Guichê 04” e “Sistema Online” são textos fixos.

## Tecnologias e versões

As versões exatas vêm de [package-lock.json](package-lock.json); `package.json` utiliza intervalos com `^`.

| Dependência de aplicação | Declarada | Resolvida |
| --- | --- | --- |
| React | ^19.2.0 | 19.2.4 |
| React DOM | ^19.2.0 | 19.2.4 |
| React Router DOM | ^7.13.1 | 7.13.1 |
| Firebase | ^12.10.0 | 12.10.0 |
| qrcode.react | ^4.2.0 | 4.2.0 |
| Sass | ^1.99.0 | 1.99.0 |

| Ferramenta de desenvolvimento | Declarada | Resolvida |
| --- | --- | --- |
| Vite | ^7.3.1 | 7.3.1 |
| TypeScript | ^7.0.2 | 7.0.2 |
| @vitejs/plugin-react | ^5.1.1 | 5.1.4 |
| ESLint | ^9.39.1 | 9.39.3 |
| @eslint/js | ^9.39.1 | 9.39.3 |
| eslint-plugin-react-hooks | ^7.0.1 | 7.0.1 |
| eslint-plugin-react-refresh | ^0.4.24 | 0.4.26 |
| globals | ^16.5.0 | 16.5.0 |
| @types/react | ^19.2.7 | 19.2.14 |
| @types/react-dom | ^19.2.3 | 19.2.3 |
| sass-embedded | ^1.98.0 | 1.98.0 |

Código em TypeScript/TSX, JavaScript ESM, HTML, CSS e SCSS. TypeScript configurado com alvo ES2020 e modo estrito. O serviço de filas e a configuração Firebase permanecem em JavaScript.

Serviços usados: **Cloud Firestore** e **Firebase Authentication**. Não há uso implementado de Realtime Database, Storage, Analytics ou Messaging, apesar dos campos correspondentes na configuração. Não existe API HTTP própria, containerização ou CI/CD versionados.

Consulte também o [inventário completo de dependências do lockfile](docs/DEPENDENCIAS.md).

## Arquitetura

SPA organizada por páginas/componentes, com hook para o fluxo do cliente, contexto de autenticação e camada de serviço para o Firestore. O backend é fornecido pelo Firebase; não há servidor de aplicação próprio neste checkout.

Fluxo de emissão: botão → `gerarSenha(filaId)` → identidade existente/anônima → transação que cria senha e incrementa contador → retorno `{ numero, senhaDocId }` → atualização da tela. No celular, o retorno também é salvo em `localStorage`.

Fluxo de chamada: atendente → `chamarProximaSenha(filaId)` → seleção da próxima senha não cancelada → atualização da fila e histórico → listeners atualizam cliente/painel. A consulta de seleção é feita com `getDocs` fora das leituras transacionais; existe uma limitação de concorrência com cancelamento descrita no relatório.

As regras são avaliadas pelo Firebase. Proteger uma rota React não substitui autorização no banco.

## Modelo de dados

```text
usuarios/{uid}
  nome: string
  email: string
  role: "atendente"
  criadoEm: Timestamp do servidor

filas/{filaId}
  nome: string
  senhaAtual: number = 0
  ultimaSenhaGerada: number = 0
  ativa: boolean = true
  criadaEm: Timestamp originado de Date do cliente
  criadoPor: UID
  ultimaChamadaEm?: number em milissegundos
  intervalosChamadasMs?: number[]

  senhas/{senhaDocId}
    numero: inteiro positivo
    cancelada: boolean = false
    criadaEm: Timestamp originado de Date do cliente
    criadaPor: UID

  historico/{historicoId}
    senha: number
    chamadaEm: number em milissegundos

  cancelamentos/{senhaDocId}
    numero: number
```

Uma fila pertence ao usuário que a criou. Cada senha pertence à identidade que a emitiu. O marcador de cancelamento usa o mesmo ID de documento da senha e permite calcular posição sem expor a coleção de senhas ao público.

`aguardando`, `posicao`, `chamado` e a estimativa são derivados no navegador. O histórico registra **chamadas**, sem comprovar conclusão de atendimento. Encerrar a fila muda apenas `ativa` para false: documentos e histórico são mantidos.

Não há migrations, ORM ou schema central. O dicionário completo, o diagrama ER e as constraints estão na [auditoria técnica](docs/AUDITORIA_TECNICA.md#6-modelo-de-dados).

## Pré-requisitos

- Node.js compatível com `^20.19.0 || >=22.12.0`, requisito do Vite registrado no lockfile.
- npm; ambiente validado nesta auditoria: Node `22.19.0` e npm `10.9.3`.
- Projeto Firebase com aplicativo Web cadastrado.
- Cloud Firestore criado e regras publicadas.
- Authentication com **E-mail/senha** e **Anônimo** habilitados.
- Navegador com JavaScript, acesso à rede e suporte a `localStorage` e ao elemento `dialog`.
- Para impressão física: impressora configurada no sistema/navegador.

O projeto não fixa versões de Node/npm em `engines` ou `.nvmrc`. A configuração real do Firebase, os índices, a região, o plano e a hospedagem não foram consultados; **não foi possível confirmar isso apenas pelo código**.

## Instalação

Obtenha uma cópia deste repositório e abra o terminal na pasta que contém `package.json`.

```powershell
npm ci
Copy-Item .env.example .env.local
```

Em shells Unix, o equivalente à segunda linha é:

```sh
cp .env.example .env.local
```

`npm ci` utiliza o lockfile versionado. Não é necessário instalar dependências em `functions/`: a pasta local observada contém apenas dependências residuais e nenhum backend autoral.

## Configuração

### Variáveis de ambiente

**O `.env.example` atual omite `VITE_FIREBASE_API_KEY`, embora ela seja obrigatória.** Acrescente-a em `.env.local`. Use os valores da configuração do aplicativo Web Firebase.

```dotenv
VITE_FIREBASE_API_KEY=valor_do_app_web
VITE_FIREBASE_AUTH_DOMAIN=dominio_do_app
VITE_FIREBASE_PROJECT_ID=id_do_projeto
VITE_FIREBASE_APP_ID=id_do_app_web

VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

| Variável | Obrigatória pelo código | Uso |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Sim | Configuração do app e Authentication |
| `VITE_FIREBASE_AUTH_DOMAIN` | Sim | Configuração Authentication |
| `VITE_FIREBASE_PROJECT_ID` | Sim | Identificação do projeto |
| `VITE_FIREBASE_APP_ID` | Sim | Identificação do aplicativo Web |
| `VITE_FIREBASE_DATABASE_URL` | Não | Campo de configuração; Realtime Database não é usado |
| `VITE_FIREBASE_STORAGE_BUCKET` | Não | Campo de configuração; Storage não é usado |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Não | Campo de configuração; Messaging não é usado |
| `VITE_FIREBASE_MEASUREMENT_ID` | Não | Campo de configuração; Analytics não é usado |

`src/firebase/firebaseConfig.js` lança um erro na inicialização se qualquer campo obrigatório estiver vazio. Reinicie o servidor de desenvolvimento após alterar o ambiente. As variáveis `VITE_*` são consumidas pelo frontend: não coloque chaves privadas, service accounts ou segredos administrativos nesses campos. `.env.local` está ignorado pelo Git.

### Preparação do Firebase

1. Cadastre um aplicativo Web no projeto escolhido e copie sua configuração.
2. Habilite E-mail/senha e Anônimo no Authentication. O provedor anônimo é necessário para a retirada sem conta, conforme a [documentação Firebase](https://firebase.google.com/docs/auth/web/anonymous-auth).
3. Crie o Cloud Firestore e publique o conteúdo revisado de [firestore.rules](firestore.rules) em um projeto de desenvolvimento.
4. Confira os domínios autorizados aplicáveis ao ambiente.
5. Inicie a aplicação e crie o primeiro usuário pela tela `/cadastro`.

O código cria os documentos durante o uso. Não existe seed. Não há `firebase.json`, `.firebaserc`, configuração de emuladores ou arquivo de índices; portanto não há comando de deploy Firebase pronto no repositório. Não use a publicação das regras atuais como evidência de segurança completa: há lacunas documentadas abaixo.

## Execução

### Desenvolvimento

```powershell
npm run dev
```

Abra o endereço informado pelo Vite. Para acesso pelo celular na mesma rede:

```powershell
npm run dev -- --host 0.0.0.0
```

Abra `/totem/{filaId}` usando o IP ou hostname acessível ao celular. O QR Code usa a origem da página; se abrir pelo endereço `localhost`, o celular tentará acessar seu próprio localhost. Verifique também as permissões de rede/firewall do computador.

### Build e prévia local

```powershell
npm run build
npm run preview
```

O build gera `dist/`. Preview é uma ferramenta de inspeção local do build, não o servidor de produção, conforme o [guia de publicação do Vite](https://vite.dev/guide/static-deploy.html).

### Produção

1. Configure as variáveis do app Web no ambiente de build.
2. Execute `npm ci` e as verificações de lint/tipos.
3. Execute `npm run build`.
4. Publique `dist/` em um servidor de arquivos estáticos com HTTPS.
5. Configure fallback das rotas da SPA para `index.html`; assets existentes devem continuar sendo servidos normalmente.
6. Configure o domínio no Firebase e publique as regras revisadas do banco.
7. Verifique acesso direto a `/fila/{id}`, `/admin/{id}` e `/totem/{id}`.

O repositório usa URLs absolutas como `/logo_sua_vez.png` e `/fila/...`; a publicação pressupõe a raiz do domínio. Hospedagem em subdiretório exige ajustes. Alterações em variáveis de ambiente exigem novo build. Não há pipeline, provedor ou domínio de produção definido no código.

## Guia de uso

### Primeiro atendimento

1. Acesse `/cadastro` e crie a conta do responsável.
2. Em `/`, informe o nome da fila ou deixe vazio para usar `Fila principal`.
3. Clique em **Iniciar Atendimento**. O ID estará na URL `/admin/{filaId}`.
4. Abra `/totem/{filaId}` para apresentar o QR Code e a retirada impressa.
5. Abra `/painel/{filaId}` em uma sessão autenticada do mesmo responsável.
6. Em outro navegador ou contexto de sessão, acesse `/fila/{filaId}` e retire uma senha.
7. No atendimento, clique em **Próxima Senha**. O cliente verá “É a sua vez!” quando os números coincidirem.
8. Ao terminar, use **Encerrar Fila** e confirme.

Com múltiplas filas, prefira a URL específica `/painel/{filaId}`. O atalho atual da tela de atendimento aponta para `/painel`, que escolhe a fila ativa mais recente do usuário.

### Exemplo com cancelamento

Emita senhas 1, 2 e 3 em três contextos de cliente. Antes da primeira chamada, a senha 3 tem duas pessoas à frente. Cancele a senha 2 com confirmação: a senha 3 passa a ter uma pessoa à frente. Chame a senha 1 e depois avance novamente: o serviço seleciona a senha 3, ignorando a cancelada.

### Recuperação e lembrete

A senha móvel é guardada sob `fila-digital:senha:{filaId}`. Recarregar a página pode recuperar a referência, desde que a sessão continue autorizada a ler aquela senha. Isso não é transferência entre dispositivos nem autenticação pelo número.

O lembrete abre a cada cinco minutos com a página visível. **Continuar na fila** ou Escape adia o aviso. **Sair da fila** inicia a confirmação de cancelamento. Não há cancelamento automático por falta de resposta. O prazo do próximo aviso é salvo por fila e ID de senha.

### Impressão

No totem, **IMPRIMIR SENHA** primeiro persiste a emissão e depois abre a impressão. O comprovante permanece até **Concluir**. Cancelar a impressão não desfaz a senha. Não existe comprovação de papel impresso, reimpressão dedicada ou vínculo automático entre o ticket e o celular.

## Rotas e API

### Rotas do frontend

Não há API REST própria neste projeto. A coluna GET descreve a abertura inicial da SPA no servidor estático, não operações de negócio. A navegação interna é controlada pelo React Router.

| Método inicial | Rota | Parâmetros | Acesso | Tela / retorno |
| --- | --- | --- | --- | --- |
| GET | `/` | — | Não anônimo | `IniciarFila` |
| GET | `/iniciar-fila` | — | Não anônimo | `IniciarFila` |
| GET | `/login` | Estado interno `de`, opcional | Público | `Login` |
| GET | `/cadastro` | — | Público | `Cadastro` |
| GET | `/fila/:codigo` | `codigo`: ID Firestore da fila | Público | `Cliente` |
| GET | `/admin/:filaId` | `filaId`: ID da fila | Não anônimo; dados do proprietário | `Atendente` |
| GET | `/painel` | — | Não anônimo | `Painel` da fila pessoal mais recente |
| GET | `/painel/:filaId` | `filaId`: ID da fila | Não anônimo; dados do proprietário | `Painel` específico |
| GET | `/totem/:filaId` | `filaId`: ID da fila | Público | `QRCodeFila` |

Retorno inicial: HTML/JavaScript da aplicação. Não há contratos JSON ou status HTTP de domínio autorais. `/qr/:filaId` está comentada e não funciona como rota. Não há página 404 dedicada. Rotas públicas usam identidade Firebase para emitir/cancelar e ler a senha própria.

### Contratos de src/services/filaService.js

| Função | Parâmetros | Retorno | Efeito |
| --- | --- | --- | --- |
| `criarFila` | `nome` | Promise com ID string | Cria fila ativa |
| `gerarSenha` | `filaId` | Promise com `{numero, senhaDocId}` | Cria senha e incrementa contador |
| `cancelarSenha` | `filaId, senhaDocId` | Promise void | Marca senha e publica cancelamento |
| `chamarProximaSenha` | `filaId` | Promise void | Avança chamada e grava histórico; sem elegível, não grava |
| `finalizarFila` | `filaId` | Promise void | Define `ativa: false` |
| `escutarFila` | `filaId, callback` | Unsubscribe | Entrega fila com `id` ou null |
| `escutarSenha` | `filaId, senhaDocId, callback` | Unsubscribe | Entrega dados da senha ou undefined |
| `escutarPosicaoNaFila` | `filaId, meuNumero, callback` | Unsubscribe | Entrega quantidade de pessoas à frente |
| `escutarFilasDoAdmin` | `callback` | Unsubscribe | Entrega filas ativas pessoais ordenadas por criação |
| `escutarFilaAtiva` | `callback` | Unsubscribe | Entrega primeira fila pessoal ou null |
| `escutarFilaAdministrativa` | `filaId, callback` | Unsubscribe | Entrega fila própria com `aguardando` derivado |
| `escutarHistorico` | `filaId, callback` | Unsubscribe | Entrega histórico decrescente por chamada |
| `getPosicaoNaFila` | `filaId, meuNumero` | Promise number | Sem uso atual; contagem antiga inclui senhas já chamadas |
| `escutarFilasAtivas` | `callback` | Unsubscribe | Sem uso atual; query sem dono não atende às regras de listagem |

`obterUsuarioPublico` é helper interno, não exportado. `AuthProvider` expõe `login(email, senha)`, `cadastrar(email, senha, nome)` e `logout()`, todos com `Promise<void>`, além de `usuario` e `carregando`.

Exemplo de integração dentro do frontend, após configuração e identidade autorizada:

```js
import { escutarFila } from './services/filaService';

const cancelarEscuta = escutarFila(filaId, (fila) => {
  console.log(fila?.senhaAtual);
});

// No cleanup do componente:
cancelarEscuta();
```
### Ordem e posição

- Nova fila começa com senha atual 0 e contador de emissão 0.
- O serviço emite `ultimaSenhaGerada + 1` por transação.
- A próxima chamada é o menor número maior que o atual e não cancelado.
- A posição usa `max(meuNumero - senhaAtual - 1 - canceladasNaFrente, 0)`.
- Cancelamentos considerados estão estritamente entre o atual e o número do cliente; números são deduplicados.
- Zero pessoas à frente significa ser o próximo; chamada ocorre somente quando o contador atual alcança o próprio número.
- Se a chamada ultrapassar a senha, a referência local é removida.
- A tela encerrada tem precedência sobre cancelada, chamada e espera.

Essas regras descrevem o caminho normal do serviço. As regras atuais do banco não garantem todas as invariantes contra operações diretas.

### Estimativa de espera

`calcularEstimativa` utiliza até 20 intervalos positivos e finitos entre chamadas. A primeira chamada não produz intervalo. Ao registrar um intervalo, o serviço usa como início o maior valor entre a última chamada e a criação da próxima senha, evitando incluir o período anterior à chegada dessa pessoa.

O cálculo usa a média multiplicada por `pessoasÀFrente + 1`, subtrai o tempo desde a última chamada e limita o restante a zero. A faixa usa o maior valor entre uma medida de dispersão baseada na variância amostral e 25% da previsão total. O contador é atualizado a cada segundo durante a espera.

Com média de 60 segundos, duas pessoas à frente e 30 segundos decorridos, a previsão restante é 150 segundos. A faixa arredondada desse exemplo, com uma única amostra, é de 1 a 4 minutos.

Trata-se de **heurística**, não de intervalo de confiança ou garantia de atendimento. O sistema mede intervalos de chamada, sem timestamps de conclusão. Relógios de dispositivos, ociosidade e atendimentos de durações diferentes afetam a previsão. A [auditoria](docs/AUDITORIA_TECNICA.md#55-estimativa-de-espera) apresenta as fórmulas completas.

## Estrutura do projeto

```text
fila-digital/
├── public/
│   ├── logo_sua_vez.png
│   └── logout.svg
├── src/
│   ├── assets/react.svg
│   ├── componentes/QRCodeFila.tsx + .scss
│   ├── firebase/
│   │   ├── AuthContext.tsx
│   │   └── firebaseConfig.js
│   ├── pages/
│   │   ├── Auth/                       # Login, Cadastro e estilos
│   │   ├── IniciarFila/                # Lista/criação e InicioFila
│   │   ├── Atendente/                  # Administração e histórico
│   │   ├── Painel/                     # Monitor de chamadas
│   │   └── Cliente/
│   │       ├── Cliente.tsx
│   │       ├── Clientes.types.ts
│   │       ├── useCliente.ts
│   │       ├── estimativaEspera.ts
│   │       └── componentes/
│   │           ├── TelaEntrada/
│   │           ├── TelaAguardando/
│   │           ├── TelaChamado/
│   │           ├── TelaCancelada/
│   │           ├── TelaEncerrada/
│   │           └── LembreteFila/
│   ├── routes/Routes.tsx + ProtectedRoute.tsx
│   ├── services/filaService.js
│   ├── App.tsx
│   ├── App.css                         # Remanescente sem import
│   ├── main.tsx
│   ├── index.css
│   └── global.d.ts
├── docs/
│   ├── AUDITORIA_TECNICA.md
│   └── DEPENDENCIAS.md
├── .env.example
├── .gitignore
├── firestore.rules
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tsconfig.json
├── eslint.config.js
└── README.md
```

Componentes usam PascalCase; funções e variáveis, camelCase em português. Hooks começam com `use`. Estilos ficam próximos das telas, mas as classes são globais e não CSS Modules. `dist/`, `node_modules/` e arquivos locais não integram o código versionado.

