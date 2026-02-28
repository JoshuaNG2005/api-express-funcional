/**
 * Controlador de Médicos
 * @description Operaciones para la tabla 'medicos' en AWS RDS
 */
const { pool: db } = require('../config/database');

class MedicoController {
    /**
     * Obtiene todos los médicos
     */
    static async getAll(req, res) {
        try {
            // CORRECCIÓN: Usamos id_Medicos según tu Workbench
            const [rows] = await db.query(
                'SELECT id_Medicos, nombre, especialidad, telefono, email, estado FROM medicos'
            );
            
            res.status(200).json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error en MedicoController.getAll:', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Registro de médico con nombres de columna corregidos
     */
    static async create(req, res) {
        try {
            const { nombre, especialidad, telefono, email } = req.body;

            // Intentaremos con Mayúsculas, que es el estilo de tu id_Medicos
            const [result] = await db.query(
                'INSERT INTO medicos (Nombre, Especialidad, Telefono, Email, Estado) VALUES (?, ?, ?, ?, ?)',
                [nombre, especialidad, telefono, email, 'activo']
            );

            res.status(201).json({
                success: true,
                message: 'Médico registrado exitosamente',
                id: result.insertId
            });
        } catch (error) {
            console.error('Error detallado:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Fallo en la base de datos',
                error: error.message // Esto nos dirá qué columna sigue fallando
            });
        }
    }
}

module.exports = MedicoController;
