import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cliente from "../pages/Cliente/Cliente";
import Atendente from "../pages/Atendente/Atendente";
import Painel from "../pages/Painel/Painel";
import QRCodeFila from "../componentes/QRCodeFila";
import IniciarFila from "../pages/IniciarFila/IniciarFila";

export default function Router() {

  return (

    <BrowserRouter>

      <Routes>
        <Route
            path="/"
            element={<IniciarFila />}
        />

        <Route
          path="/fila/:codigo"
          element={<Cliente />}
        />

        <Route
          path="/admin/:filaId"
          element={<Atendente />}
        />

        <Route
          path="/painel"
          element={<Painel />}
        />

        <Route
          path="/painel/:filaId"
          element={<Painel />}
        />

        {/* <Route
          path="/qr/:filaId"
          element={<QRCodeFila />}
        /> */}

        <Route
          path="/totem/:filaId"
          element={<QRCodeFila />}
        />

      </Routes>

    </BrowserRouter>

  );

}