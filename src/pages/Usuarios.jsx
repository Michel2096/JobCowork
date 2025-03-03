import UsuarioForm from "../components/UsuarioForm";
import { Link } from "react-router-dom";

const Usuarios = () => {
    return (
        <div className="container">
            <h1>Formulario</h1>


            <UsuarioForm />
        </div>
    );
}

export default Usuarios;