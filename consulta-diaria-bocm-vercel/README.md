# Consulta Diaria BOCM · v15

Correcciones de estabilidad:

- Las peticiones fallidas o agotadas ya no derriban toda la consulta.
- La estimación del número de boletín incluye los sábados y localiza antes la edición correcta.
- Los candidatos se comprueban en pequeños grupos paralelos para reducir el tiempo de respuesta.
- Programa Regional de Inversiones es una regla adicional de inclusión, no un requisito para el resto de anuncios de la sección D).

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


## Cambios v11

- La combinación `AYUNTAMIENTO DE ...` + `URBANISMO` se detecta por el contenido del anuncio, incluso cuando el BOCM no conserva la etiqueta `III. Administración Local` en el enlace del sumario.
- Se incluyen siempre las referencias al Programa Regional de Inversiones.
- Se mantiene la exclusión de Autoridades y Personal y los filtros temáticos anteriores.


## Cambios v11

- Se muestra la marca temporal `AAAAAAAA` en la esquina superior derecha para comprobar visualmente el despliegue.
- En A) Disposiciones Generales se incluyen expresamente las publicaciones que aprueben, modifiquen o deroguen una ley.
- Se mantienen todas las leyes que ya se incluían en versiones anteriores.
