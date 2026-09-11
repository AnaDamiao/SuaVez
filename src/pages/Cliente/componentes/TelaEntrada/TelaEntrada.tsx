import "./TelaEntrada.styles.scss";
import { ITelaEntrada } from "./TelaEntrada.types";
import { useState } from "react";


export default function TelaEntrada({ onPegarSenha, loading, erro }: ITelaEntrada) {
  const [telefone, setTelefone] = useState("");
  return (
    <div className="page">
      <div className="card">
        <h1 className="titulo">Fila Digital</h1>
        <p className="sub">
          Retire sua senha e acompanhe o atendimento pelo celular.
        </p>

        <form className="entrada-form" onSubmit={(event) => {
          event.preventDefault();
          void onPegarSenha(telefone);
        }}>
          <label htmlFor="telefone">Celular com DDD (opcional)</label>
          <input id="telefone" type="tel" inputMode="tel" autoComplete="tel"
            placeholder="(11) 99999-9999" maxLength={22} value={telefone}
            onChange={(event) => setTelefone(event.target.value)} disabled={loading}
            aria-describedby="telefone-ajuda" />
          <p id="telefone-ajuda" className="entrada-ajuda">
            Ao informar seu celular, você autoriza um SMS com “É SUA VEZ” quando
            sua senha for chamada. Se preferir, deixe em branco e acompanhe por aqui.
          </p>
          {erro && <p className="entrada-erro" role="alert">{erro}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Gerando…" : "Retirar senha"}
        </button>
        </form>
      </div>
    </div>
  );
}
