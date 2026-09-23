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
- `/hooks`: Hooks personalizados (`useAuth`).
- `/lib`: Utilidades y configuración de API (Axios).

---

## 🎨 Sistema de Diseño

Los tokens viven en `app/globals.css` (`@theme`, Tailwind v4). La paleta está inspirada en
Indigo Velvet `#4A306D`, Sunflower Gold `#E5B212`, Turf Green `#1A7B44`, Carbon Black `#1C1C1E`
y Parchment `#F7F5F0`.

**Escalas (50–950):**
- `brand-*` — índigo institucional. `brand-600` es el color madre; `brand-950` para fondos oscuros y títulos.
- `gold-*` — dorado. `gold-500` para acentos sobre fondos oscuros; `gold-700`+ para texto sobre fondos claros (contraste AA).
- `green-*` — verde para estados de éxito (`emerald-*` es alias).
- `neutral-*` — neutros cálidos, del pergamino al carbón.

**Roles semánticos (úsalos antes que la escala):**
- Superficies: `bg-background`, `bg-card`, `bg-muted`, `bg-surface-subtle`, `bg-surface-brand`, `bg-surface-warm`, `bg-parchment`.
- Texto: `text-foreground`, `text-muted-foreground`, `text-text-secondary`, `text-text-tertiary`.
- Bordes: `border-border`, `border-border-subtle`, `border-border-strong`, `border-input`.
- Acciones y estados: `bg-primary`, `bg-secondary`, `bg-accent`, `bg-success`, `bg-warning`, `bg-destructive`, `ring-ring`.

**Reglas:**
- Nada de hex sueltos ni paletas ajenas de Tailwind (`slate`, `gray`, `amber`, `blue`). Si falta un token, se agrega en `globals.css`.
- En estilos inline usa `var(--color-brand-950)` y compañía, nunca el hex.
- Sombras: `shadow-xs` … `shadow-2xl`, `shadow-soft`, `shadow-float` (ya vienen teñidas de índigo).

---

## 🔒 Seguridad

El acceso a carpetas protegidas (`/admin`, etc.) está controlado por el componente `RoleGuard`.
El token de sesión se almacena en `localStorage` y se inyecta automáticamente en las peticiones via `lib/api.ts`.