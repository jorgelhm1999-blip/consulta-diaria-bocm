[README.md](https://github.com/user-attachments/files/30304097/README.md)
# Consulta Diaria BOCM · versión Vercel

Esta versión no necesita instalar Node.js en el ordenador desde el que se utiliza. La aplicación se publica en Vercel y se abre mediante una URL normal.

## Publicación sin instalar programas

### 1. Crear un repositorio en GitHub

1. Entra en GitHub desde el navegador y crea una cuenta si no la tienes.
2. Pulsa **New repository**.
3. Nombre recomendado: `consulta-diaria-bocm`.
4. Selecciona **Private** si no quieres que el código sea público.
5. Crea el repositorio sin añadir README, licencia ni `.gitignore`.
6. Dentro del repositorio, pulsa **uploading an existing file**.
7. Arrastra todos los archivos y carpetas contenidos en esta carpeta. Deben quedar en la raíz del repositorio:
   - `api/`
   - `lib/`
   - `index.html`
   - `app.js`
   - `styles.css`
   - `package.json`
   - `vercel.json`
8. Pulsa **Commit changes**.

### 2. Importar el proyecto en Vercel

1. En Vercel pulsa **Add New... > Project**.
2. Conecta tu cuenta de GitHub cuando te lo solicite.
3. Importa el repositorio `consulta-diaria-bocm`.
4. En **Framework Preset**, selecciona **Other** si Vercel no lo detecta automáticamente.
5. No cambies Root Directory, Build Command ni Output Directory.
6. Pulsa **Deploy**.

Vercel proporcionará una URL parecida a:

`https://consulta-diaria-bocm.vercel.app`

## Uso

Abre la URL, selecciona una fecha y, opcionalmente, introduce un municipio. Si el municipio queda vacío, se revisan todos.

## Nota

La consulta se hace bajo demanda. No se descargan ni almacenan todos los PDF del BOCM.
