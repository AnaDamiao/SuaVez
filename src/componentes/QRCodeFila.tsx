import { QRCodeCanvas } from "qrcode.react";
import { useParams } from "react-router-dom";

export default function QRCodeFila() {

  const { filaId } = useParams();

  const url = `${window.location.origin}/fila/${filaId}`;

  return (

    <div>

      <h2>Escaneie para entrar na fila</h2>

      <QRCodeCanvas
        value={url}
        size={256}
      />

      <a href={url} target="__blank">{"URL DE ACESSO"}</a>

    </div>

  );

}