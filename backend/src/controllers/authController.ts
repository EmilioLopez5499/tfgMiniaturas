import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

export async function registrar(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ error: 'Todos los campos son obligatorios' });
      return;
    }

    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email, rol',
      [nombre, email, password_hash]
    );

    const usuario = resultado.rows[0];
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, usuario });

  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      return;
    }

    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
      return;
    }

    const usuario = resultado.rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });

  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}