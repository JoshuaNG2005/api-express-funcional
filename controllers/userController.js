/**
 * Controlador de Usuarios
 * @description Maneja todas las operaciones HTTP para la entidad Usuario (MySQL - AWS)
 */

const { pool: db } = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

class UserController {

    /**
     * Registra un nuevo usuario
     */
    static async register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        try {
            const { nombre, telefono, email, password, direccion } = req.body;

            // Verificamos en la tabla 'usuarios'
            const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (existing && existing.length) {
                return res.status(409).json({
                    success: false, 
                    message: 'El correo ya está registrado' 
                });
            }

            const hashed = await bcrypt.hash(password, 10);

            // Insertamos con los nombres de columnas de tu Workbench
            const [result] = await db.query(
                'INSERT INTO usuarios (nombre, telefono, email, password, direccion, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, telefono || null, email, hashed, direccion || null, 'cliente', 'activo']
            );

            return res.status(201).json({ 
                success: true, 
                message: 'Usuario creado correctamente', 
                id: result.insertId 
            });

        } catch (error) {
            console.error('ERROR register ->', error.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor', 
                error: error.message 
            });
        }
    }

    /**
     * Obtiene todos los usuarios
     */
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // IMPORTANTE: Se usa 'fecha_creacion' porque así está en tu BD
            const query = 'SELECT id, nombre, email, telefono, rol, estado, fecha_creacion FROM usuarios LIMIT ? OFFSET ?';
            const [users] = await db.query(query, [limit, offset]);

            const [countResult] = await db.query('SELECT COUNT(*) as total FROM usuarios');
            const totalUsers = countResult[0].total;

            res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers / limit),
                    totalUsers
                }
            });
        } catch (error) {
            console.error('Error en getAllUsers:', error.message);
            res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
        }
    }

    /**
     * Obtiene un usuario por su ID
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(
                'SELECT id, nombre, email, telefono, direccion, rol, estado, fecha_creacion FROM usuarios WHERE id = ?', 
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            res.status(200).json({ success: true, data: rows[0] });
        } catch (error) {
            console.error('Error en getUserById:', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Actualiza un usuario
     */
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { nombre, email, telefono, direccion, estado } = req.body;

            const [result] = await db.query(
                'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, estado = ? WHERE id = ?',
                [nombre, email, telefono, direccion, estado, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error en updateUser:', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Elimina un usuario
     */
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteUser:', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = UserController;