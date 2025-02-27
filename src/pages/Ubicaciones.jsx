import UbicacionesForm from "../components/UbicacionesForm";
import UbicacionesList from "../components/UbicacionesList";

const Ubicaciones = () => {
    return (
        <div className="container">
            <UbicacionesForm />
            <br />
            <UbicacionesList />

        </div>
    );
}

export default Ubicaciones;