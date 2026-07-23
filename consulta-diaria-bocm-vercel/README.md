# Consulta Diaria BOCM · v8

Aplicación web desplegable en Vercel para consultar un BOCM por fecha y mostrar publicaciones de interés técnico.

## Cambios v8

- Se retira temporalmente la búsqueda histórica de la interfaz.
- Se añade una cabecera gráfica propia.
- Se excluyen ayudas, subvenciones y disposiciones de contenido exclusivamente ganadero o agrario.
- Una publicación agraria o ganadera sí se conserva cuando también trata urbanismo, obra civil, expropiaciones o materias ambientales territoriales.

## Estructura

- `index.html`, `app.js`, `styles.css`: interfaz.
- `assets/cabecera-bocm.png`: cabecera gráfica.
- `api/search.js`: función de consulta diaria.
- `lib/bocm.js`: lectura y clasificación de anuncios.


## Cambios v9
- Se refuerza la detección de Plan Parcial y del resto de materias urbanísticas municipales.
- En III. Administración Local se incluye siempre un anuncio cuando aparecen conjuntamente un encabezado `AYUNTAMIENTO DE ...` y el epígrafe `URBANISMO`.
- Esta regla tiene prioridad sobre el filtrado por palabras clave para evitar falsos negativos.
