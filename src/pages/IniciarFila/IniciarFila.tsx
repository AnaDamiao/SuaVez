import { criarFila } from "../../services/filaService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { escutarFilasAtivas } from "../../services/filaService";
import { InicioFila } from "./componentes/InicioFila/InicioFila";

interface FilaAtiva {
  id: string;
  nome?: string;
  senhaAtual?: number;
  ultimaSenhaGerada?: number;
}

export default function IniciarFila() {
  const navigate = useNavigate();
  const [nomeFila, setNomeFila] = useState("");
  const [loading, setLoading] = useState(false);
  const [filasAtivas, setFilasAtivas] = useState<FilaAtiva[]>([]);

  useEffect(() => {
    const unsub = escutarFilasAtivas((filas: FilaAtiva[]) => {
      setFilasAtivas(filas);
    });

    return () => unsub();
  }, []);

  async function iniciar() {
    setLoading(true);
    const nome = nomeFila.trim() || "Fila principal";
    const filaId = await criarFila(nome);
    navigate(`/admin/${filaId}`);
  }

  function abrirFila(filaId: string) {
    navigate(`/admin/${filaId}`);
  }

  return (
    <InicioFila
      nomeFila={nomeFila}
      setNomeFila={setNomeFila}
      loading={loading}
      onSubmit={iniciar}
      filasAtivas={filasAtivas}
      onAbrirFila={abrirFila}
    />
  );
}
