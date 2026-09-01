import { BrowserRouter, Routes, Route } from "react-router-dom";

import Cliente from "../pages/Cliente/Cliente";
import Atendente from "../pages/Atendente/Atendente";
import Painel from "../pages/Painel/Painel";
import QRCodeFila from "../componentes/QRCodeFila";
import IniciarFila from "../pages/IniciarFila/IniciarFila";
import Login from "../pages/Auth/Login";
import Cadastro from "../pages/Auth/Cadastro";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {

  return (

    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute><IniciarFila /></ProtectedRoute>}
        />

        <Route
          path="/iniciar-fila"
          element={<ProtectedRoute><IniciarFila /></ProtectedRoute>}
        />

        <Route
          path="/fila/:codigo"
          element={<Cliente />}
        />

        <Route
          path="/admin/:filaId"
          element={<ProtectedRoute><Atendente /></ProtectedRoute>}
        />

        <Route
          path="/painel"
          element={<ProtectedRoute><Painel /></ProtectedRoute>}
        />

        <Route
          path="/painel/:filaId"
          element={<ProtectedRoute><Painel /></ProtectedRoute>}
        />

        {/* <Route
          path="/qr/:filaId"
          element={<QRCodeFila />}
        /> */}

        <Route
          path="/totem/:filaId"
          element={<QRCodeFila />}
        />

        <Route 
          path="/login" 
          element={<Login />} 
        />
        
        <Route 
          path="/cadastro" 
          element={<Cadastro />}
        />
      </Routes>

    </BrowserRouter>
  );
}