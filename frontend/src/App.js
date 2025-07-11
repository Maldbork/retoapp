
import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nivel, setNivel] = useState('facil');
  const [reto, setReto] = useState(null);
  const [foto, setFoto] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [ranking, setRanking] = useState([]);

  const backendURL = 'https://retoapp-backend.up.railway.app';

  const registrar = async () => {
    const res = await fetch(`${backendURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(data.user) {
      setUsuarioId(data.user.id);
      setMensaje('Usuario registrado correctamente');
    } else {
      setMensaje('Error al registrar');
    }
  };

  const pedirReto = async () => {
    const res = await fetch(`${backendURL}/reto/${nivel}`);
    if(res.ok) {
      const data = await res.json();
      setReto(data);
      setMensaje('');
    } else {
      setMensaje('No hay retos disponibles para ese nivel');
      setReto(null);
    }
  };

  const subirEvidencia = async () => {
    if(!foto || !usuarioId || !reto) {
      setMensaje('Faltan datos para subir evidencia');
      return;
    }
    const formData = new FormData();
    formData.append('foto', foto);
    formData.append('usuario_id', usuarioId);
    formData.append('reto_id', reto.id);
    const res = await fetch(`${backendURL}/evidencia`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setMensaje(data.message || 'Error al subir evidencia');
    setReto(null);
  };

  const cargarRanking = async () => {
    const res = await fetch(`${backendURL}/ranking`);
    const data = await res.json();
    setRanking(data);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Reto App</h1>
      <h2>Registro</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={registrar}>Registrar</button>
      <p>{mensaje}</p>

      <h2>Solicitar reto</h2>
      <select value={nivel} onChange={e => setNivel(e.target.value)}>
        <option value="facil">Fácil</option>
        <option value="medio">Medio</option>
        <option value="dificil">Difícil</option>
      </select>
      <button onClick={pedirReto}>Pedir reto</button>

      {reto && (
        <div>
          <h3>Reto: {reto.descripcion}</h3>
          <input type="file" onChange={e => setFoto(e.target.files[0])} />
          <button onClick={subirEvidencia}>Subir evidencia</button>
        </div>
      )}

      <h2>Ranking Top 100</h2>
      <button onClick={cargarRanking}>Cargar Ranking</button>
      <ul>
        {ranking.map((user, i) => (
          <li key={i}>{user.email}: {user.puntaje}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
