
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const upload = multer({ dest: 'uploads/' });

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO usuarios (email, password, puntaje) VALUES ($1, $2, 0) RETURNING *', [email, password]);
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reto/:nivel', async (req, res) => {
  const { nivel } = req.params;
  try {
    const result = await pool.query('SELECT * FROM retos WHERE nivel = $1 ORDER BY RANDOM() LIMIT 1', [nivel]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No hay retos para ese nivel' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/evidencia', upload.single('foto'), async (req, res) => {
  const { usuario_id, reto_id } = req.body;
  const fotoPath = req.file.path;
  try {
    await pool.query('INSERT INTO evidencias (usuario_id, reto_id, foto_path) VALUES ($1, $2, $3)', [usuario_id, reto_id, fotoPath]);
    // Aumentar puntaje del usuario (simplificado)
    await pool.query('UPDATE usuarios SET puntaje = puntaje + 10 WHERE id = $1', [usuario_id]);
    res.json({ message: 'Evidencia subida y puntaje actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/ranking', async (req, res) => {
  try {
    const result = await pool.query('SELECT email, puntaje FROM usuarios ORDER BY puntaje DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en puerto ${port}`);
});
