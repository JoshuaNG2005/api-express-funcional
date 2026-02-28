/**
 * Controlador de Mascotas
 * @description Maneja las operaciones para la tabla 'mascotas' en AWS RDS
 */
const { pool: db } = require('../config/database');

class MascotaController {

    /**
     * Obtiene todas las mascotas
     * CORRECCIÓN: Nombre de tabla 'mascotas'
     */
    static async getAll(req, res) {
        try {
            // Seleccionamos las columnas reales de tu tabla
            const [rows] = await db.query('SELECT id, nombre, especie, raza, id_usuario FROM mascotas');
            
            res.status(200).json({
                success: true,
                message: 'Mascotas obtenidas correctamente',
                data: rows
            });
        } catch (error) {
            console.error('Error en MascotaController.getAll:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor',
                error: error.message 
            });
        }
    }

    /**
     * Registra una nueva mascota
     */
    static async create(req, res) {
        try {
            const { nombre, especie, raza, id_usuario } = req.body;

            // Validación básica
            if (!nombre || !especie || !id_usuario) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios (nombre, especie, id_usuario)'
                });
            }

            const [result] = await db.query(
                'INSERT INTO mascotas (nombre, especie, raza, id_usuario) VALUES (?, ?, ?, ?)',
                [nombre, especie, raza || null, id_usuario]
            );

            res.status(201).json({
                success: true,
                message: 'Mascota registrada correctamente',
                id: result.insertId
            });
        } catch (error) {
            console.error('Error en MascotaController.create:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error al registrar mascota',
                error: error.message 
            });
        }
    }
}

module.exports = MascotaController;