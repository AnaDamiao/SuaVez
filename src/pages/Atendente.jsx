import { chamarProximaSenha, finalizarFila, escutarFila } from "../services/filaService";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Atendente() {

  const { filaId } = useParams();
  const navigate = useNavigate();

  const [fila, setFila] = useState({});

  useEffect(() => {

    const unsub = escutarFila(filaId, setFila);

    return () => unsub();

  }, [filaId]);

  async function chamar() {

    if (!fila?.ativa) {
      alert("A fila já foi finalizada.");
      navigate("/");
      return;
    }

    await chamarProximaSenha(filaId);

  }

  async function finalizar() {
    await finalizarFila(filaId);
  }

  return (

    <div>

      <h1>Painel do Atendente</h1>

      <button onClick={chamar}>
        Chamar próxima senha
      </button>

      <button onClick={finalizar}>
        Finalizar fila
      </button>

      <h2>Senha Atual</h2>

      <h1>{fila?.senhaAtual || 0}</h1>

    </div>

  );

}