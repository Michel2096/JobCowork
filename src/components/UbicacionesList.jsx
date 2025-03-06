import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { Line } from "react-chartjs-2"; // Importa el gráfico de líneas de Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Registra los componentes de Chart.js que vas a usar (necesario para que Chart.js funcione)
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

    // Exportar ubicaciones a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredUbicaciones);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ubicaciones");
        XLSX.writeFile(workbook, "ubicaciones.xlsx");
    };

    // Importar ubicaciones desde Excel
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

 // Preparar los datos para el gráfico de líneas
 const prepareLineChartData = () => {
    // Se cuenta cuántas ubicaciones hay por cada tipo
    const tipoCount = ubicaciones.reduce((acc, ubicacion) => {
        acc[ubicacion.tipo] = (acc[ubicacion.tipo] || 0) + 1;
        return acc;
    }, {});

    return {
        labels: Object.keys(tipoCount), // Tipos como etiquetas
        datasets: [
            {
                label: 'Ubicaciones por Tipo', // Título de la gráfica
                data: Object.values(tipoCount), // Datos de la gráfica (conteo de ubicaciones por tipo)
                fill: false, // No llenar el área bajo la línea
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                tension: 0.1, // Curvatura de la línea
                borderWidth: 2, // Grosor de la línea
            }
        ],
    };
};
    return (
        <div className="fond-usuario">
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="roles-buttons">
                        <button onClick={() => navigate("/credencial")} className="role-button">Regresar</button>
                        <button className="role-button" onClick={() => navigate("/userlist")}>Usuarios</button>
                        <button className="role-button" onClick={() => navigate("/horarioform")}>Horarios</button>
                    </div>
                </div>
            </nav>
            <br /><br />
            <h1 className="titulo-ubicaciones">Ubicaciones</h1>
            {error && <p className="error-message">{error}</p>}

            <div>
                <label>🔎 Buscar en Ubicaciones:</label>
                <input
                    type="text"
                    placeholder="Buscar ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tabla-ubicaciones"
                />
            </div>

            <div className="tabla-ubicaciones">
                <button onClick={exportToExcel} className="role-button">📤 Exportar a Excel</button>
                <input type="file" accept=".xlsx" onChange={(e) => setSelectedFile(e.target.files[0])} className="import-input" />
                <button onClick={importFromExcel} className="role-button">📥 Importar desde Excel</button>
            </div>

            <table className="tabla-ubicaciones">
                <thead>
                    <tr>
                        <th>n.</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUbicaciones.length > 0 ? (
                        currentUbicaciones.map((ubicacion) => (
                            <tr key={ubicacion.id_ubicacion} className="fila-ubicaciones">
                                <td>{ubicacion.id_ubicacion}</td>
                                <td>{ubicacion.nombre}</td>
                                <td>{ubicacion.tipo}</td>
                                <td className="acciones-ubicaciones">
                                    <Link to={`/ubiedit/${ubicacion.id_ubicacion}`} className="enlace-usuario">Editar</Link>
                                    <button onClick={() => handleDelete(ubicacion.id_ubicacion)} className="boton-usuario">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>No se encontraron resultados</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="paginacion" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                {currentPage > 1 && (
                    <button onClick={prevPage} className="boton-paginacion">⬅</button>
                )}
                {indexOfLastUbicacion < filteredUbicaciones.length && (
                    <button onClick={nextPage} className="boton-paginacion">➡</button>
                )}
            </div>

             {/* Gráfico de Ubicaciones por Tipo */}
            <div style={{ width: '50%', margin: 'auto', paddingTop: '20px' }}>
                <Line data={prepareLineChartData()} options={{ responsive: true }} />
            </div>
            <br /><br /><br />

            
        </div>
    );
};

export default UbicacionesList;
