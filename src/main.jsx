import  React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Credencial from "./pages/Credencial";
import UsuarioList from "./components/UsuarioList";
import UsuarioEdit from "./components/UsuarioEdit"
import Ubicaciones from "./pages/Ubicaciones";
import UbicacionesList from "./components/UbicacionesList";
import UbicacionesEdit from "./components/UbicacionesEdit";
import HorarioList from "./components/HorarioList";
import Horarios from "./pages/Horarios";
import HorarioEdit from "./components/HorarioEdit";

;
//import UsuarioEdit from "./components/UsuarioEdit";
//import Usuario from "./pages/Usuarios";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/form" element={<Usuarios />} />
      <Route path='/credencial' element={<Credencial />}/>

      <Route path="/userlist" element={<UsuarioList />} />
      <Route path="/useredit/:id" element={<UsuarioEdit />} />

      <Route path="/ubiform" element={<Ubicaciones />} />
      <Route path="/ubiedit/:id" element={<UbicacionesEdit />} />
      <Route path="/ubilist" element={<UbicacionesList />} />

      <Route path="/horarioform" element={<Horarios />} />
      <Route path="/horarioedit/:id" element={<HorarioEdit />} />
      <Route path="/horariolist" element={<HorarioList />} />
      
    </Routes>
  </BrowserRouter>
);