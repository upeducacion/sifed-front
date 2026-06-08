# UP Educación Frontend (Portal & Dashboard)

Interfaz de usuario para el Sistema de Gestión Académica - Facultad de Educación UNCP.
Construido con **Next.js 16**, **Tailwind CSS v4** y **React 19**.

> ⚠️ **ACCESO RESTRINGIDO:** Este es un repositorio privado. El código es propiedad exclusiva de Sudolabs Perú.

## 🚀 Guía de Instalación para Desarrolladores

### 1. Prerrequisitos
- Node.js 18 o superior (Recomendado: LTS).
- Git.

### 2. Clonar el Repositorio
```bash
git clone https://github.com/SudolabsDigital/sifed-front.git
cd sifed-front
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```ini
# URL de la API (Backend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# URL base del Backend (para cookies CSRF)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:3000`

---

## 📂 Estructura del Proyecto

- `/app`: Rutas y páginas (App Router).
  - `/admin`: Dashboard administrativo.
  - `/docente`: Portal del docente.
  - `/estudiante`: Aula virtual.
  - `/login`: Hub de servicios y autenticación.
- `/components`: Componentes reutilizables.
  - `/ui`: Elementos base (botones, cards).
  - `/layout`: Header, Sidebar, Shells.
  - `/auth`: Formularios y lógica de protección.
- `/hooks`: Hooks personalizados (`useAuth`, `useMediaQuery`).
- `/lib`: Utilidades y configuración de API (Axios).

---

## 🎨 Sistema de Diseño

Usamos variables CSS semánticas (definidas en `globals.css`):
- **Primary:** `bg-brand-600` (Azul Institucional)
- **Secondary:** `bg-brand-50` (Fondos suaves)
- **Accent:** `text-uncp-gold` (Dorado)

---

## 🔒 Seguridad

El acceso a carpetas protegidas (`/admin`, etc.) está controlado por el componente `RoleGuard`.
El token de sesión se almacena en `localStorage` y se inyecta automáticamente en las peticiones via `lib/api.ts`.