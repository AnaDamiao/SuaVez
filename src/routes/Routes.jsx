import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cliente from "../pages/Cliente";
import Atendente from "../pages/Atendente";
import Painel from "../pages/Painel";
import QRCodeFila from "../componentes/QRCodeFila";
import IniciarFila from "../pages/IniciarFila";

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
          path="/painel/:filaId"
          element={<Painel />}
        />

        <Route
          path="/qr/:filaId"
          element={<QRCodeFila />}
        />

      </Routes>

    </BrowserRouter>

  );

}