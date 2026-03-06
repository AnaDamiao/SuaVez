import { useParams } from "react-router-dom";
import { gerarSenha } from "../services/filaService";
import { useState } from "react";

export default function Cliente() {

  const { codigo } = useParams();

  const [senha, setSenha] = useState(null);

  async function pegarSenha() {

    const numero = await gerarSenha(codigo);

    setSenha(numero);

  }

  return (

    <div>

      <h1>Fila Digital</h1>

      <button onClick={pegarSenha}>
        Retirar senha
      </button>

      {senha && <h2>Sua senha: {senha}</h2>}

    </div>

  );

}