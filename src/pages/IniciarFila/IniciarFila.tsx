import { criarFila } from "../../services/filaService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { InicioFila } from './componentes/InicioFila/InicioFila'


export default function IniciarFila() {
  const navigate = useNavigate();
  const [nomeFila, setNomeFila] = useState("");
  const [loading, setLoading] = useState(false);

  async function iniciar() {
    setLoading(true);
    const nome = nomeFila.trim() || "Fila principal";
    const filaId = await criarFila(nome);
    navigate(`/admin/${filaId}`);
  }

  return (
    <InicioFila
      nomeFila={nomeFila}
      setNomeFila={setNomeFila}
      loading={loading}
      onSubmit={iniciar}
    />
  );
}