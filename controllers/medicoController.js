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
            // Usamos * para que traiga todas las columnas sin importar el nombre exacto
            const [rows] = await db.query('SELECT * FROM medicos');
            
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
     * Registra un nuevo médico
     * CORRECCIÓN: Nombres de columnas con Mayúsculas
     */
    static async create(req, res) {
        try {
            const { nombre, especialidad, telefono, email } = req.body;

            // Intentamos con nombres en Mayúscula (ajusta si en tu Workbench ves otros nombres)
            const query = 'INSERT INTO medicos (Nombre, Especialidad, Telefono, Email, Estado) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [nombre, especialidad, telefono, email, 'activo']);

            res.status(201).json({
                success: true,
                message: 'Médico registrado exitosamente',
                id: result.insertId
            });
        } catch (error) {
            console.error('Error al insertar médico:', error.message);
            res.status(500).json({ 
                success: false, 
                message: 'Fallo en la base de datos',
                error: error.message // Si falla, Postman te dirá EXACTAMENTE qué columna no reconoce
            });
        }
    }
}

module.exports = MedicoController;
