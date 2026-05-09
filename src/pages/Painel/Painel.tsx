import { useEffect, useState } from "react";
import { escutarFila } from "../../services/filaService";
import { useParams } from "react-router-dom";

interface Fila {
  senhaAtual: number;
  ativa?: boolean;
}

export default function Painel() {
  const { filaId } = useParams<{ filaId: string }>();

  const [fila, setFila] = useState<Fila | null>(null);

  useEffect(() => {
    if (!filaId) return;

    const unsub = escutarFila(filaId, (dados: Fila | null) => {
      if (dados) setFila(dados);
    });

    return () => unsub();
  }, [filaId]);

  if (!fila) {
    return <p>Carregando...</p>;
  }

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "60px"
      }}
    >
      <h1>Senha Atual</h1>

      <h1>{fila.senhaAtual}</h1>
    </div>
  );
}