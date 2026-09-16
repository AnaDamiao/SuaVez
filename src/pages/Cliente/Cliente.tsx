import { useParams } from "react-router-dom";
import { useCliente } from "./useCliente";

import TelaEntrada from "./componentes/TelaEntrada/TelaEntrada";
import TelaAguardando from "./componentes/TelaAguardando/TelaAguardando";
import TelaChamado from "./componentes/TelaChamado/TelaChamado";
import TelaCancelada from "./componentes/TelaCancelada/TelaCancelada";
import TelaEncerrada from "./componentes/TelaEncerrada/TelaEncerrada";
import LembreteFila from "./componentes/LembreteFila/LembreteFila";

export default function Cliente() {
  const { codigo } = useParams();

  const {
    senha,
    senhaAtual,
    posicao,
    cancelada,
    filaAtiva,
    loading,
    confirmando,
    chamado,
    pegarSenha,
    handleCancelar,
    setConfirmando,
    resetar,
    tempoEstimado
  } = useCliente(codigo);

  if (!filaAtiva) return <TelaEncerrada/>;

  if (cancelada) return <TelaCancelada onReset={resetar} />;

  if (chamado && senha)
    return <TelaChamado senha={senha.numero} />;

  if (senha)
    return (
      <>
      <TelaAguardando
        senha={senha.numero}
        senhaAtual={senhaAtual}
        posicao={posicao}
        tempoEstimado={tempoEstimado}
        confirmando={confirmando}
        onCancelar={handleCancelar}
        onVoltar={() => setConfirmando(false)}
      />
      <LembreteFila
        key={`${codigo}:${senha.senhaDocId}`}
        identificador={`${codigo}:${senha.senhaDocId}`}
        senha={senha.numero}
        confirmando={confirmando}
        onSair={handleCancelar}
      />
      </>
    );

  return <TelaEntrada onPegarSenha={pegarSenha} loading={loading} />;
}
