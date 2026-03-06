import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeFila( filaId ) {

  const { filaId } = useParams();

  const url = `${window.location.origin}/fila/${filaId}`;

  return (

    <div>

      <h1>QR Code da Fila</h1>

      <p>Escaneie para entrar na fila</p>

      <QRCodeCanvas
        value={url}
        size={250}
      />

      <p>{url}</p>

    </div>

  );

}