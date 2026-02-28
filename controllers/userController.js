/**
 * Controlador de Usuarios
 * @description Maneja todas las operaciones HTTP para la entidad Usuario corregido para MySQL/AWS
 */

const { pool: db } = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

class UserController {

    /**
     * Registra un nuevo usuario
     * CORRECCIÓN: De 'users' a 'usuarios'
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
            const { nombre, telefono, email, password } = req.body;

            // CORREGIDO: Tabla usuarios
            const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
            if (existing && existing.length) {
                return res.status(409).json({
                    success: false, 
                    message: 'El correo ya está registrado' 
                });
            }

            const hashed = await bcrypt.hash(password, 10);

            // CORREGIDO: Tabla usuarios
            const [result] = await db.query(
                'INSERT INTO usuarios (nombre, telefono, email, password) VALUES (?, ?, ?, ?)',
                [nombre, telefono || null, email, hashed]
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
                error: "Error al crear usuario" 
            });
        }
    }

    /**
     * Obtiene todos los usuarios
     * CORRECCIÓN: De 'users' a 'usuarios' y campos consistentes
     */
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const search = req.query.search;

            let query;
            let queryParams;
            let countQuery;

            // CORREGIDO: Todas las referencias de 'users' a 'usuarios'
            if (search) {
                query = 'SELECT id, nombre, email, telefono, fecha_creacion FROM usuarios WHERE nombre LIKE ? LIMIT ? OFFSET ?';
                queryParams = [`%${search}%`, limit, offset];
                countQuery = 'SELECT COUNT(id) as total FROM usuarios WHERE nombre LIKE ?';
            } else {
                query = 'SELECT id, nombre, email, telefono, fecha_creacion FROM usuarios LIMIT ? OFFSET ?';
                queryParams = [limit, offset];
                countQuery = 'SELECT COUNT(id) as total FROM usuarios';
            }

            const [users] = await db.query(query, queryParams);
            const [countRows] = await db.query(countQuery, search ? [`%${search}%`] : []);
            
            const totalUsers = countRows[0].total;
            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers
                }
            });
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    /**
     * Obtiene un usuario por ID
     * CORRECCIÓN: Tabla 'usuarios'
     */
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query('SELECT id, nombre, email, telefono, fecha_creacion FROM usuarios WHERE id = ?', [id]);

            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            res.status(200).json({ success: true, data: rows[0] });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    /**
     * Elimina un usuario
     * CORRECCIÓN: Tabla 'usuarios'
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
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
}

module.exports = UserController;