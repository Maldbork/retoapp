
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    puntaje INTEGER DEFAULT 0
);

CREATE TABLE retos (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    nivel VARCHAR(10) NOT NULL CHECK (nivel IN ('facil', 'medio', 'dificil'))
);

CREATE TABLE evidencias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    reto_id INTEGER REFERENCES retos(id),
    foto_path TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO retos (descripcion, nivel) VALUES
('Mostrar un letrero de tal dirección', 'facil'),
('Comprar un pan y mostrar foto', 'facil'),
('Tocar botones de un ascensor', 'medio'),
('Sacarse una foto con dos policías', 'medio'),
('Completar reto difícil con pago', 'dificil');
