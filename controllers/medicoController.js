/**
 * Controlador de Médicos
 * @description Operaciones para la tabla 'medicos' en AWS RDS
 */
const { pool: db } = require('../config/database');

class MedicoController {
    /**
     * Obtiene todos los médicos activos
     */
    static async getAll(req, res) {
        try {
            // Consultamos la tabla 'medicos'
            const [rows] = await db.query(
                'SELECT id, nombre, especialidad, telefono, email, estado FROM medicos WHERE estado = "activo"'
            );
            
            res.status(200).json({
                success: true,
                count: rows.length,
                data: rows
            });
        } catch (error) {
            console.error('Error en MedicoController.getAll:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener la lista de médicos',
                error: error.message 
            });
        }
    }

    /**
     * Registra un nuevo médico
     */
    static async create(req, res) {
        try {
            const { nombre, especialidad, telefono, email } = req.body;

            // Insertamos con los campos de tu tabla
            const [result] = await db.query(
                'INSERT INTO medicos (nombre, especialidad, telefono, email, estado) VALUES (?, ?, ?, ?, ?)',
                [nombre, especialidad, telefono, email, 'activo']
            );

            res.status(201).json({
                success: true,
                message: 'Médico registrado exitosamente',
                id: result.insertId
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = MedicoController;
