# Consulta Diaria BOCM

Aplicación web para Vercel que consulta el sumario diario del BOCM y muestra únicamente publicaciones ajustadas a los criterios internos.

## Criterios activos

- Comunidad de Madrid, A) Disposiciones Generales: todas las leyes.
- Comunidad de Madrid, B) Autoridades y Personal: nada.
- Comunidad de Madrid, C) Otras Disposiciones: Consejería de Medio Ambiente, Agricultura e Interior.
- Comunidad de Madrid, D) Anuncios: Consejería de Vivienda, Transportes e Infraestructuras y Consejería de Medio Ambiente, Agricultura e Interior.
- Administración Local, Ayuntamientos: Urbanismo, Estudio de detalle, Plan Especial, Proyecto de Urbanización, Plan Parcial y Expropiación.
- Regla transversal: licitaciones abiertas relacionadas con ingeniería civil o urbanismo.
- Se excluyen adjudicaciones, formalizaciones, modificaciones, desistimientos y contratos ya resueltos.
- Se excluye Metro de Madrid.
- Se preserva “zona de policía”, pero se excluyen plazas y procesos de Policía Local o fuerzas de seguridad.
- Solo se consultan y enlazan páginas HTML.


## Cambios v5

- Inclusión transversal de anuncios relativos a expropiaciones, expedientes expropiatorios, actas previas, justiprecios y bienes o derechos afectados.
- Inclusión de subvenciones, ayudas, convenios y adendas vinculados a urbanismo u obra civil.
- Ampliación de términos de rehabilitación, regeneración, renovación urbana y mejora del entorno físico.
- Normalización de palabras partidas por guion y salto de línea.


## Versión 6 · Descripciones automáticas

La aplicación limpia la navegación y los metadatos de las páginas HTML del BOCM y genera una descripción administrativa breve sin utilizar servicios de inteligencia artificial externos. Para ello detecta la actuación principal, su fase de tramitación, el municipio y las materias técnicas relevantes.

La etiqueta **v6** aparece junto al título de la aplicación para comprobar visualmente que el último despliegue está activo.
