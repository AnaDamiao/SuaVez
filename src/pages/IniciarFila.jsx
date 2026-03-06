import { criarFila } from "../services/filaService";
import { useNavigate } from "react-router-dom";

export default function IniciarFila() {

  const navigate = useNavigate();

  async function iniciar() {

    const filaId = await criarFila("Fila principal");

    navigate(`/admin/${filaId}`);

  }

  return (

    <div>

      <h1>Iniciar Fila</h1>

      <button onClick={iniciar}>
        Iniciar atendimento
      </button>

    </div>

  );

}