import { useEffect, useState } from "react";
import { escutarFila } from "../services/filaService";
import { useParams } from "react-router-dom";

export default function Painel() {

  const { filaId } = useParams();

  const [fila, setFila] = useState({});

  useEffect(() => {

    const unsub = escutarFila(filaId, setFila);

    return () => unsub();

  }, []);

  return (

    <div style={{
      textAlign: "center",
      fontSize: "60px"
    }}>

      <h1>Senha Atual</h1>

      <h1>{fila?.senhaAtual}</h1>

    </div>

  );

}