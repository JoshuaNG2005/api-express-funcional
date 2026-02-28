/**
 * Modelo de Usuario
 * @description Maneja todas las operaciones CRUD para la entidad Usuario en MySQL
 */

// IMPORTANTE: Asegúrate de importar el pool correctamente desde tu config
const { initDatabase } = require('../config/database');

/**
 * Normaliza una fila de la BD a formato esperado por la aplicación
 */
function normalizeRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        nombre: row.nombre,
        email: row.email,
        telefono: row.telefono,
        rol: row.rol, // Agregado para consistencia con tu sistema de roles
        password: row.password,
        created_at: row.fecha_creacion || row.created_at || null,
        updated_at: row.fecha_actualizacion || row.updated_at || null
    };
}

class User {
    /**
     * Helper para obtener el pool de conexión
     */
    static async getPool() {
        return await initDatabase();
    }

    /**
     * Obtiene todos los usuarios
     */
    static async findAll() {
        try {
            const pool = await this.getPool();
            const [rows] = await pool.execute(
                'SELECT * FROM usuarios ORDER BY fecha_creacion DESC'
            );
            return rows.map(r => normalizeRow(r));
        } catch (error) {
            console.error('Error en User.findAll:', error);
            throw new Error('Error al obtener usuarios');
        }
    }

    /**
     * Busca un usuario por su email (CORREGIDO: ? para MySQL)
     */
    static async findByEmail(email) {
        try {
            const pool = await this.getPool();
            const normalizedEmail = email.toLowerCase().trim();
            const [rows] = await pool.execute(
                'SELECT * FROM usuarios WHERE LOWER(email) = ?',
                [normalizedEmail]
            );
            return rows.length > 0 ? normalizeRow(rows[0]) : null;
        } catch (error) {
            console.error('Error en User.findByEmail:', error);
            throw new Error('Error al buscar usuario por email');
        }
    }

    /**
     * ELIMINA UN USUARIO (CORREGIDO: De "users" a "usuarios")
     */
    static async delete(id) {
        try {
            const pool = await this.getPool();
            const [result] = await pool.execute(
                'DELETE FROM usuarios WHERE id = ?', // Aquí estaba el error "Table users doesn't exist"
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en User.delete:', error);
            throw new Error('Error al eliminar usuario');
        }
    }

    /**
     * Cuenta el total (CORREGIDO: Tabla usuarios)
     */
    static async count() {
        try {
            const pool = await this.getPool();
            const [rows] = await pool.execute('SELECT COUNT(*) as total FROM usuarios');
            return rows[0].total;
        } catch (error) {
            console.error('Error en User.count:', error);
            throw new Error('Error al contar usuarios');
        }
    }

    // ... El resto de tus métodos (create, update, paginate) 
    // deben usar "usuarios" y el método "await this.getPool()"
}

module.exports = User;