import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cowork from '../assets/cowork.jpeg';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ correo: '', pass: '' });
    const [error, setError] = useState('');
    const [intentos, setIntentos] = useState(0);
    const [bloqueado, setBloqueado] = useState(false);

    useEffect(() => {
        const intentosFallidos = localStorage.getItem('intentosFallidos') || 0;
        const bloqueoTiempo = localStorage.getItem('bloqueoTiempo');
        if (bloqueoTiempo && new Date().getTime() < bloqueoTiempo) {
            setBloqueado(true);
            const tiempoRestante = bloqueoTiempo - new Date().getTime();
            setTimeout(() => {
                setBloqueado(false);
                localStorage.removeItem('bloqueoTiempo');
                localStorage.setItem('intentosFallidos', '0');
            }, tiempoRestante);
        } else {
            setIntentos(parseInt(intentosFallidos));
        }
    }, []);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (bloqueado) return;

        try {
            const response = await axios.post('http://localhost:3001/api/login', usuario);
            const { usuario: user, token } = response.data;

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            localStorage.setItem('usuario', JSON.stringify(user));  
            localStorage.setItem('token', token);  
            setError('');
            localStorage.setItem('intentosFallidos', '0'); // Reinicia intentos al éxito
            navigate('/credencial'); 
        } catch (error) {
            const nuevosIntentos = intentos + 1;
            setIntentos(nuevosIntentos);
            localStorage.setItem('intentosFallidos', nuevosIntentos);
            setError('Credenciales incorrectas. Inténtalo de nuevo.');

            if (nuevosIntentos >= 3) {
                const tiempoDesbloqueo = new Date().getTime() + 3 * 60 * 1000; // 3 minutos
                localStorage.setItem('bloqueoTiempo', tiempoDesbloqueo);
                setBloqueado(true);
                setTimeout(() => {
                    setBloqueado(false);
                    localStorage.removeItem('bloqueoTiempo');
                    localStorage.setItem('intentosFallidos', '0');
                }, 3 * 60 * 1000);
            }
        }
    };

    return (
        <div className='container'>
            
            <form onSubmit={handleSubmit}>
                <img id="logo" src={cowork} alt="Logo" />  
                <input type="email" name="correo" placeholder='Correo' onChange={handleChange} required disabled={bloqueado} /> 
                <input type="password" name="pass" placeholder='Contraseña' onChange={handleChange} required disabled={bloqueado} />

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {bloqueado && <p style={{ color: 'red' }}>Demasiados intentos fallidos. Intenta nuevamente en 3 minutos.</p>}

                <button type="submit" className="login-button" disabled={bloqueado}>Iniciar sesión</button>

                <p>¿No tienes cuenta?{' '}
                    <Link to="/form"><button className="register-button" disabled={bloqueado}>Regístrate</button></Link>
                    <Link to="/form"><button className="register-button" disabled={bloqueado}>Recuperar contraseña</button></Link>
                </p>

                <button className='login-button-s' onClick={() => navigate("/")} disabled={bloqueado}>Salir</button>
            </form>
        </div>
    );
};

export default Login;
