import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UbicacionesList = () => {
    const navigate = useNavigate();
    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const ubicacionesPerPage = 4;

    useEffect(() => {
        axios.get("http://localhost:3001/api/ubicaciones")
            .then(response => setUbicaciones(response.data))
            .catch(error => {
                console.error(error);
                setError("Error al cargar las ubicaciones. Por favor, intenta de nuevo más tarde.");
            });
    }, []);

    const handleDelete = async (id) => {
        axios.delete(`http://localhost:3001/api/ubicaciones/${id}`)
            .then(() => setUbicaciones(ubicaciones.filter(ubicacion => ubicacion.id_ubicacion !== id)))
            .catch(error => console.error(error));
    };

    const filteredUbicaciones = ubicaciones.filter(ubicacion =>
        ubicacion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUbicacion = currentPage * ubicacionesPerPage;
    const indexOfFirstUbicacion = indexOfLastUbicacion - ubicacionesPerPage;
    const currentUbicaciones = filteredUbicaciones.slice(indexOfFirstUbicacion, indexOfLastUbicacion);

    const nextPage = () => {
        if (indexOfLastUbicacion < filteredUbicaciones.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredUbicaciones);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ubicaciones");
        XLSX.writeFile(workbook, "ubicaciones.xlsx");
    };

    const importFromExcel = () => {
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo primero.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const importedData = XLSX.utils.sheet_to_json(sheet);

            axios.post("http://localhost:3001/api/ubicaciones/importar", { ubicaciones: importedData })
                .then(() => {
                    setUbicaciones([...ubicaciones, ...importedData]);
                    alert("Ubicaciones importadas correctamente");
                })
                .catch(error => console.error("Error en la importación:", error));
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const prepareLineChartData = () => {
        const tipoCount = ubicaciones.reduce((acc, ubicacion) => {
            acc[ubicacion.tipo] = (acc[ubicacion.tipo] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(tipoCount),
            datasets: [
                {
                    label: 'Ubicaciones por Tipo',
                    data: Object.values(tipoCount),
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    borderWidth: 2,
                }
            ],
        };
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
                <div className="container-fluid">
                    <h2 className="text-white mb-0">Lista de Ubicaciones</h2>
                    <div>
                        <button onClick={() => navigate("/credencial")} className="btn btn-primary me-2">Regresar</button>
                        <button onClick={() => navigate("/userlist")} className="btn btn-primary me-2">Usuarios</button>
                        <button onClick={() => navigate("/horarioform")} className="btn btn-primary">Horarios</button>
                    </div>
                </div>
            </nav>

            {/* Contenido Principal */}
            <div className="container flex-grow-1 p-4">
                <h1 className="text-center mb-4">Ubicaciones</h1>
                {error && <p className="text-danger text-center">{error}</p>}

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar ubicación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="mb-4 d-flex gap-2">
                    <button onClick={exportToExcel} className="btn btn-success">
                        <i className="bi bi-file-earmark-excel"></i> Exportar a Excel
                    </button>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="form-control w-auto"
                    />
                    <button onClick={importFromExcel} className="btn btn-warning">
                        <i className="bi bi-file-earmark-arrow-up"></i> Importar desde Excel
                    </button>
                </div>

                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUbicaciones.length > 0 ? (
                            currentUbicaciones.map((ubicacion) => (
                                <tr key={ubicacion.id_ubicacion}>
                                    <td>{ubicacion.id_ubicacion}</td>
                                    <td>{ubicacion.nombre}</td>
                                    <td>{ubicacion.tipo}</td>
                                    <td>
                                        <Link to={`/ubiedit/${ubicacion.id_ubicacion}`} className="btn btn-primary btn-sm me-2">
                                            <i className="bi bi-pencil"></i> Editar
                                        </Link>
                                        <button onClick={() => handleDelete(ubicacion.id_ubicacion)} className="btn btn-danger btn-sm">
                                            <i className="bi bi-trash"></i> Eliminar
                                        </button>
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

                <div className="d-flex justify-content-between mb-4">
                    <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-secondary">
                        <i className="bi bi-arrow-left"></i> Anterior
                    </button>
                    <button onClick={nextPage} disabled={indexOfLastUbicacion >= filteredUbicaciones.length} className="btn btn-secondary">
                        Siguiente <i className="bi bi-arrow-right"></i>
                    </button>
                </div>

                <div className="mb-4">
                    <Line data={prepareLineChartData()} options={{ responsive: true }} />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">Aviso de privacidad: Este sitio cumple con las normativas de protección de datos.</p>
            </footer>
        </div>
    );
};

export default UbicacionesList;