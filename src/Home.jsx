import React from "react";
import { Link } from "react-router-dom";
import Fondo from './assets/Fondo.png';
import llave from './assets/llave.png';
import Cerradura from './assets/Cerradura.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="container-fluid p-0">
      {/* Sección de fondo con imagen */}
      <div
        className="position-relative vh-100"
        style={{
          backgroundImage: `url(${Fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Header */}
        <header className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center">
          <h1 className="text-white display-4">CoWorkLock</h1>
          <Link to="/login" className="btn btn-light">Login</Link>
        </header>

        {/* Texto principal */}
        <section className="position-absolute top-50 start-0 end-0 text-center text-white">
          <p className="lead">Controla y monitorea el acceso en tiempo real desde una sola plataforma.</p>
          <p className="h4">Vigila tus espacios y <strong>protegé</strong> tu integridad.</p>
        </section>

        {/* Botones */}
        <section className="position-absolute bottom-0 start-0 end-0 text-center mb-5">
          <button className="btn btn-primary me-3">Más información</button>
          <button className="btn btn-success">Contratar ahora</button>
        </section>
      </div>

      {/* Sección 3 */}
      <section className="bg-light py-5 text-center">
        <p className="h3">COWORKLOCK PARA EMPRESAS INNOVADORAS Y USUARIOS EXIGENTES</p>
      </section>

      {/* Sección 4 */}
      <section className="container my-5">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-5">Optimiza la gestión de accesos</h1>
            <p className="lead">
              Simplifica la gestión de accesos con cerraduras inteligentes intuitivas y eficientes, diseñadas para entornos profesionales modernos.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 5 */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-3">Acceso 24/7 a espacios de trabajo modernos.</li>
                <li className="mb-3">Conexión a una comunidad de profesionales innovadores.</li>
                <li className="mb-3">Instalaciones equipadas con tecnología de punta.</li>
                <li className="mb-3">Flexibilidad para adaptarse a tus necesidades.</li>
                <li className="mb-3">Eventos exclusivos para networking y aprendizaje.</li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <img src={llave} alt="Imagen de coworking" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección 6 */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <img src={Cerradura} alt="Imagen de seguridad" className="img-fluid" />
          </div>
          <div className="col-md-6">
            <h2>La Importancia de la Seguridad</h2>
            <p>
              La seguridad es un pilar fundamental en cualquier entorno, especialmente en espacios de coworking. Un sistema robusto de seguridad garantiza la protección de los activos, la privacidad de los usuarios y la tranquilidad necesaria para que las empresas puedan enfocarse en su crecimiento.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 7 */}
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h1 className="display-5">Seguridad sin complicaciones</h1>
          <p className="lead">
            Protege tus espacios con soluciones de acceso inteligente que combinan seguridad y facilidad de uso. Perfecto para empresas exigentes.
          </p>
          <p className="mt-4">
            Creado por <strong>MBP Industries</strong> - Tu confianza, nuestra prioridad.
          </p>
        </div>
      </section>

      {/* Sección 8 */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1 className="display-6">Contáctanos</h1>
              <p className="lead">
                Estamos aquí para ayudarte. Utiliza los datos de contacto a continuación para ponerte en contacto con nosotros.
              </p>
            </div>
            <div className="col-md-6">
              <div className="contact-info">
                <p><strong>Teléfono:</strong> +52 1 55 4006 0457</p>
                <p><strong>Correo Electrónico:</strong> brendalaruqisregañin@mbpindustries.com</p>
                <p><strong>Dirección:</strong> Av. Chapultepec n0.35 San Mateo Atarasquillo</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;