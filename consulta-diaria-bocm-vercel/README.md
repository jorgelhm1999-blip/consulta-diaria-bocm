# Consulta Diaria BOCM · v18

La consulta se realiza en dos fases para evitar tiempos de espera excesivos en Vercel:

1. Se lee el sumario y se seleccionan únicamente los anuncios candidatos según sección, organismo, epígrafe y palabras clave.
2. Solo se abren los HTML candidatos para comprobar el contenido, aplicar exclusiones y generar la descripción breve.

La regla «Programa Regional de Inversiones» es una vía adicional de inclusión y no un requisito para el resto de anuncios de la sección D).

## Actualización

Sustituir `lib/bocm.js`, `index.html`, `package.json` y `README.md`.
