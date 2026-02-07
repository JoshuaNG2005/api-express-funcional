# 👥 Guía para Colaboradores

## 🎯 Para empezar a trabajar en el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/api-express-mysql.git
cd api-express-mysql
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar tu .env local
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Luego edita `.env` con tus credenciales de MySQL local.

### 4. Crear la base de datos
```bash
mysql -u root -p < docs/database.sql
```

O copia y pega el contenido de `docs/database.sql` en MySQL Workbench.

### 5. Ejecutar el proyecto
```bash
npm run dev
```

---

## 🔄 Flujo de trabajo con Git

### Antes de empezar a programar
```bash
# Ver en qué rama estás
git branch

# Actualizar tu código con los cambios más recientes
git pull origin main
```

### Mientras programas
```bash
# Ver qué archivos modificaste
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "descripción de lo que hiciste"

# Subir tus cambios
git push origin main
```

### Buenas prácticas
- ✅ Hacer commits pequeños y frecuentes
- ✅ Mensajes de commit descriptivos
- ✅ Hacer `git pull` antes de empezar a trabajar
- ✅ Probar que todo funcione antes de hacer `push`
- ❌ NO subir el archivo `.env` (ya está en .gitignore)
- ❌ NO hacer push sin probar el código

---

## 📝 Mensajes de commit recomendados

```bash
git commit -m "feat: agregar endpoint de estadísticas"
git commit -m "fix: corregir error en login"
git commit -m "docs: actualizar README con nuevas rutas"
git commit -m "refactor: mejorar validaciones de usuario"
```

---

## 🆘 Problemas comunes

### Error: "Cannot connect to database"
- Verifica que MySQL esté corriendo
- Revisa tus credenciales en `.env`
- Asegúrate de haber creado la base de datos

### Error: "Port 3001 already in use"
- Cambia el puerto en `.env` a otro (ejemplo: 3002)
- O cierra la aplicación que está usando ese puerto

### Conflictos al hacer git pull
```bash
# Guarda tus cambios temporalmente
git stash

# Actualiza el código
git pull origin main

# Recupera tus cambios
git stash pop
```

---

## 📞 Contacto

Si tienes dudas, pregunta en el grupo o revisa la documentación en el README.
