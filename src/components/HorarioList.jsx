import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorarioList = () => {
    const navigate = useNavigate();
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const horariosPerPage = 4;

    useEffect(() => {
        axios.get("https://api.mbpindustries.xdn.com.mx/horarios/")
            .then(response => setHorarios(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar los horarios. Por favor, intenta de nuevo más tarde.");
            });

        axios.get("https://api.mbpindustries.xdn.com.mx/usuarios/")
            .then(response => setUsuarios(response.data))
            .catch(error => console.error("Error al obtener usuarios:", error));

        axios.get("https://api.mbpindustries.xdn.com.mx/ubicacion/")
            .then(response => setUbicaciones(response.data))
            .catch(error => console.error("Error al obtener ubicaciones:", error));
    }, []);

    const getUbicacionNombre = (id) => {
        const ubicacion = ubicaciones.find(ubi => ubi.id_ubicacion === id);
        return ubicacion ? ubicacion.nombre : "Desconocido";
    };

    const handleDelete = async (id) => {
        axios.delete(`https://api.mbpindustries.xdn.com.mx/horarios/${id}`)
            .then(() => setHorarios(horarios.filter(horario => horario.id_horarios !== id)))
            .catch(error => console.error(error));
    };

    const filteredHorarios = horarios.filter(horario =>
        getUbicacionNombre(horario.id_ubicacion).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastHorario = currentPage * horariosPerPage;
    const indexOfFirstHorario = indexOfLastHorario - horariosPerPage;
    const currentHorarios = filteredHorarios.slice(indexOfFirstHorario, indexOfLastHorario);

    const nextPage = () => {
        if (indexOfLastHorario < filteredHorarios.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const prepareBarChartData = () => {
        const countByUbicacion = horarios.reduce((acc, horario) => {
            const nombreUbicacion = getUbicacionNombre(horario.id_ubicacion);
            acc[nombreUbicacion] = (acc[nombreUbicacion] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(countByUbicacion),
            datasets: [
                {
                    label: "Cantidad de horarios por ubicación",
                    data: Object.values(countByUbicacion),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="main-container">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Lista de Horarios</h2>
                    <div>
                        <button onClick={() => navigate("/credencial")} className="btn btn-primary me-2">Regresar</button>
                        <button onClick={() => navigate("/userlist")} className="btn btn-primary me-2">Usuarios</button>
                        <button onClick={() => navigate("/ubiform")} className="btn btn-primary">Ubicaciones</button>
                    </div>
                </div>
            </nav>

            <div className="content-container">
                <h1 className="text-center mb-4">Horarios</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                    <label className="form-label">🔎 Buscar en Horarios:</label>
                    <input
                        type="text"
                        placeholder="Buscar horario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Ubicación</th>
                                <th>Hora de entrada</th>
                                <th>Hora de salida</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentHorarios.length > 0 ? (
                                currentHorarios.map((horario) => (
                                    <tr key={horario.id_horarios}>
                                        <td>{getUbicacionNombre(horario.id_ubicacion)}</td>
                                        <td>{horario.hora_entrada}</td>
                                        <td>{horario.hora_salida}</td>
                                        <td>
                                            <Link to={`/horarioedit/${horario.id_horarios}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                                            <button onClick={() => handleDelete(horario.id_horarios)} className="btn btn-danger btn-sm">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No se encontraron resultados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between mb-4">
                    <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-secondary">
                        <i className="bi bi-arrow-left"></i> Anterior
                    </button>
                    <button onClick={nextPage} disabled={indexOfLastHorario >= filteredHorarios.length} className="btn btn-secondary">
                        Siguiente <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="mb-4">
                    <Bar data={prepareBarChartData()} options={{ responsive: true }} />
                </div>
            </div>

            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
}

export default HorarioList;