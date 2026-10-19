# CONTEXTO — Sistema Integrado de Gestión Académica y Tecnológica · I.E.P. El Nazareno

> **Para quién:** otra IA o un compañero que no vio la conversación original.
> **Cómo usarlo:** leer este archivo completo primero. Las tareas están en `02_TAREAS_CODIGO_NAZARENO.md` y referencian los IDs `F-xx` (hallazgos) y `D-xx` (decisiones) definidos aquí.
> **Fecha de corte:** 16-oct-2026.

---

## 0. Reglas de lectura (importantes)

1. **El informe es un marco, no una especificación.** Es poco fiable: mezcla datos de dos colegios, tiene errores de redacción y sus figuras y cartas anexas (imágenes) no se pudieron leer. Úsalo para entender intención y restricciones. Cualquier requisito concreto debe validarse con los usuarios de la institución.
2. **El Drive es la evidencia más sólida** (datos reales de la institución), pero está incompleto y con inconsistencias (sección 4).
3. **No inventar datos.** Si un dato falta o es ambiguo, se registra como pendiente y va a una cola de revisión; no se rellena ni se estima.
4. **No se encontró código del sistema** (ver sección 6). Las tareas asumen construcción, salvo que se localice un repositorio existente.

---

## 1. Fuentes y su fiabilidad

| Fuente | Qué es | Fiabilidad | Identificador |
|---|---|---|---|
| Cuaderno NotebookLM "Transformación Digital Académica y Tecnológica" | 1 fuente: Informe N.º 001-2026-IEP.EN/UTDIT (PDF), sin notas, 1 chat | Baja-media (marco) | `33e6337b-1261-4678-af14-724b15d4dd1a` · fuente `2f660da0-1a78-47d3-b868-105a2f50134c` |
| Drive `COLEGIO-NAZARENO / MODULO-LOGISTICA` | 6 archivos de datos y proceso | Media (parcial, ver auditoría) | carpeta `1rNkxlSEopvYFqpdmITQkaQLAUpx9OOKV` |
| Auditoría previa de esa carpeta | Hallazgos `F-01…F-18` (sección 5) | Alta (medida sobre los archivos) | este documento |

Copias locales (equipo del usuario, carpeta Descargas): el PDF del informe (2 copias), el vale en `.docx` y `.pdf`, y la imagen del BPMN.

---

## 2. El proyecto según el informe (marco)

**Qué es.** Plataforma web modular y progresiva para la gestión académica y tecnológica de la I.E.P. El Nazareno (Educación Básica Regular), que sirve de marco a las prácticas preprofesionales de 5 estudiantes de Ingeniería de Sistemas e Informática (UTP).

**Cuándo.** Inicio 24-ago-2026, 3 meses (cierre aprox. 24-nov-2026, lo que deja unas 5 semanas desde el corte). 20 h/semana por practicante, modalidad mixta, no remunerada.

**Equipo.** 4 en desarrollo de software; 1 en hardware y soporte. Supervisión inmediata de la UTDIT (responsable externo + docente de Computación). Conducción institucional: Promotor y Director; el Subdirector coordina lo presencial.

**Qué NO es.** No replica un ERP comercial; sin finanzas ni planillas en esta etapa (podrían migrarse después: RRHH, contabilidad, finanzas).

### 2.1 Arquitectura prevista (4 capas)

| Capa | Función |
|---|---|
| Base de datos central | Registros autorizados, relaciones, historial, trazabilidad |
| Backend / API | Reglas de negocio, accesos, validaciones, seguridad, integraciones, generación de documentos |
| Frontend | Interfaces según perfil de usuario: registrar, consultar, filtrar, reportar |
| Reportes e indicadores | Consultas, fichas, reportes descargables y paneles con formatos institucionales |

Comparten una base común de **usuarios, permisos, base de datos, reportes y trazabilidad**.

### 2.2 Líneas funcionales (referenciales, sujetas a validación)

1. Identidad, usuarios y permisos (roles, accesos diferenciados, trazabilidad)
2. Gestión estudiantil y asistencia
3. Administración pedagógica (docentes, cursos, horarios, documentos)
4. Servicios y bienestar (tópico, psicología, orientación; acceso restringido)
5. Actividades y trayectoria estudiantil
6. Reportes e indicadores

> **Hallazgo de alcance:** logística, almacén, biblioteca y psicomotricidad **no están** en esas seis líneas. Tampoco coinciden con ellas las carpetas por módulo del Drive (sección 3). El informe aclara que ningún módulo es definitivo y que el alcance depende del levantamiento.

### 2.3 Frente de hardware y soporte

Inventario de equipos (por ubicación, tipo, responsable y condición), diagnóstico básico (computadoras, periféricos, proyectores, cableado), mantenimiento preventivo, registro de incidencias y recomendaciones técnicas priorizadas (renovación, repuestos, conectividad, reorganización). Producto verificable: fichas de diagnóstico, registro de mantenimiento con evidencias y estado posterior.

### 2.4 Restricciones que el código debe respetar

- Acceso restringido y confidencialidad para información personal, académica, psicológica, social o de salud.
- Desarrollo y pruebas con **datos ficticios, anonimizados o de prueba**, hasta que la Dirección autorice datos reales.
- Integraciones (correo, mensajería, QR, nube) **solo con cuentas y procedimientos institucionales autorizados**.
- Reportes y documentos con **plantillas institucionales uniformes** y trazabilidad.
- Primero levantar requerimientos y luego definir pantallas, permisos, reportes y flujos.
- **Calidad sobre cantidad:** lo que no alcance madurez queda modelado y documentado; no se entregan módulos incompletos.
- Al cierre se entrega todo organizado: código, documentación, diagramas, configuraciones, inventario, manuales, evidencias.
- Cambios en equipos que afecten la continuidad del servicio se coordinan antes con la UTDIT.
- Los practicantes no acceden por cuenta propia a información, equipos, contraseñas ni bases de datos.

### 2.5 Ruta de trabajo y evidencias del informe

| Momento | Trabajo | Evidencia |
|---|---|---|
| Inicio | Inducción, entrevistas, diagnóstico, inventario preliminar, priorización | Actas, mapa de necesidades, inventario preliminar, plan de entregas |
| Desarrollo continuo | Arquitectura, prototipos, BD, backend, frontend, mantenimiento | Prototipos, repositorio documentado, fichas técnicas |
| Validación progresiva | Demostraciones, pruebas de permisos, corrección | Observaciones, versiones corregidas, conformidad |
| Cierre | Entrega de productos, manuales, inventario final | Acta de entrega, documentación, valoración final |

### 2.6 Inconsistencias conocidas del informe

Mezcla de datos de **dos colegios** (indicado por el propietario del cuaderno); nombre del documento escrito de dos formas (`IEP.ENUTDIT` / `IEP.EN/UTDIT`); la condición "no remuneradas" se repite en dos secciones con redacción desordenada; errores de tipeo; figuras 1 y 2 y las 5 cartas del Anexo 1 no son legibles en el texto extraído.

---

## 3. Estructura del Drive

`COLEGIO-NAZARENO` (`14E0v9aHBH8f1E7jruvRGZBXU-ZWKH3zV`) contiene, al menos, cinco subcarpetas por módulo: `MODULO-LOGISTICA`, `MODULO-DIRECTOR`, `MODULO-SUBDIRECCION`, `MODULO-PSICOLOGIA`, `MODULO-SECRETARIA`. **Solo se auditó LOGISTICA**; las otras no se abrieron.

Todo el contenido de LOGISTICA tiene fecha 14–16 oct 2026 (la carpeta se creó el 14). Los archivos son propiedad de 3 cuentas distintas; el acceso es de 5 cuentas Gmail personales (1 propietaria, 4 con edición), sin cuenta institucional y sin enlace público (verificado en la carpeta y en el archivo de laptops).

---

## 4. Archivos de MODULO-LOGISTICA y su esquema

### 4.1 Proceso de requerimiento (BPMN + vale)

**BPMN** (`1AjJgcFEzTrubG-WM0Cj_bqM4pNXC05uy`, JPG). Tres carriles: Solicitante · Secretaría (filtro) · Almacén. Flujo actual (as-is):

1. Solicitante identifica necesidad → prepara vale (fecha, N.º, solicitante, requerimientos, cantidad, uso, firma).
2. Entrega el vale a Secretaría.
3. Secretaría verifica rol del solicitante y revisa el vale → decisión *¿autorizado y procedente?*
4. **Sí:** (Secretaría) "Entregar materiales" → (Almacén) "Entregar materiales" con *entregado por* y fecha → Solicitante recibe y firma como receptor → proceso completado.
5. **No:** notifica rechazo → proceso cancelado.

**Vale** (`1P3qkeD8sVIO1wqLBlRJwdjpQINZjgVPX`, `.docx`, 4 vales idénticos en blanco). Campos: encabezado "INSTITUCIÓN EDUCATIVA PRIVADA 'EL NAZARENO'"; FECHA; N.º DE VALE; SOLICITANTE; tabla N.º / REQUERIMIENTOS / CANTIDAD / USO (5 filas); FIRMA DEL DIRECTOR O SUB DIRECTOR; FIRMA DEL SOLICITANTE; ENTREGADO POR; FECHA DE ENTREGA; FIRMA DEL RECEPTOR.

### 4.2 Biblioteca (`1zPwmb0uEyO1r9K2g2OlA2rIpqLI18S49`)

14 hojas: **Biblioteca General** (consolidada, fuente maestra) + 12 por área + leyenda "Áreas y códigos". Las hojas por área coinciden 100 % con la consolidada (0 diferencias en 1.120 filas); GEN (170 filas) existe solo en la consolidada.

Columnas: `Código, Área, Tipo de material, Título/Colección, Tomo/Volumen, Tema/Contenido, Autor, Editorial, Cantidad, Estado, Ubicación, Observaciones` (+ `Código anterior` solo en Arte y Cultura).

Prefijos: COM, MAT (Matemática), CYT, SOC, ING, REL, EFI, ART, INV, TUT, FIL, CMP, DPE, GEN.

| Métrica | Valor |
|---|---|
| Registros / unidades | 1.290 / 1.518 |
| Títulos distintos | 918 (177 repetidos) |
| Estado | Bueno 692 · Regular 216 · Por verificar 382 (30 %) |
| Ubicación | "Biblioteca" en los 1.290 (sin estante) |
| Autor/editorial/tomo ausente o genérico | 56 % / 53 % / 43 % |
| Filas con cantidad > 1 | 64 (incluye colecciones ING-047 = 20 y ING-048 = 50 tomos) |

Integridad buena: códigos únicos, sin saltos, prefijo coherente con el área.

### 4.3 Laptops del laboratorio (`1utwgaOJmDw60OwVBZRdHYvoECisuzncm`)

Hojas: Inventario (29 columnas) · Resumen · Listas · Incidencias · Plan de mejora · criterios de prioridad.

- **Equipos:** 15, todos en LABORATORIO (11 Lenovo, 3 Dell, 1 HP). RAM: 10 con 4 GB, 3 con 2 GB, 2 sin dato; ninguno con 8 GB. Zorin OS (8 con 18.1; 5 con 18; 2 sin dato por contraseña).
- **Arranque:** promedio 104,4 s; 4 equipos > 120 s. Seguridad: los 13 con dato figuran "No".
- **Códigos:** formato mezclado (`L-013M`, `L-0150`, `CL0011`, `CL-0023`, `L016P`…). Además hay `Etiqueta física` `LAB-01…LAB-15` en el plan.
- **Reglas del archivo.** *Crítico* si estado físico o rendimiento Malo, pantalla no operativa o arranque > 120 s. *Revisar* si Regular, arranque 61–120 s, o algún componente/seguridad "No". Arranque ≤ 60 s es normal. Prioridades: P1 Crítico (atender primero), P2 Optimizar, P3 Operativo.
- **Listas:** Estado componente Sí/No; Estado físico y Rendimiento Bueno/Regular/Malo; Estado general Operativo/Revisar/Crítico; Tipo disco SSD/HDD/NVMe/eMMC/Otro; Acción: Sin acción inmediata / Revisión preventiva / Mantenimiento-reparación prioritaria.
- **Incidencias:** 36 (9 Alta, 27 Media): Sistema 12, Audio 7, Teclado 7, Touchpad 4, Batería 3, Acceso 2, Arranque 1; todas "Pendiente". Columnas: código equipo, componente, incidencia, prioridad, intervención sugerida, estado de atención.
- **Plan de mejora:** columnas etiqueta física, código, prioridad técnica, RAM, arranque, estado técnico, limitación observada, condición/problema, intervención recomendada, prueba de validación posterior, estado de seguimiento (todas "Pendiente"). *Prueba estándar:* encender → navegador con 5 pestañas → Writer → Calc → alternar 5–10 min.

### 4.4 Almacén (`16Ff_wCL4BB8XYtvaTCKezyuFK3B3Atkj`)

Título: "Inventario de almacén – I.E.P. El Nazareno – Actualización 2026" (14-oct). 77 registros, 24 verificados (31 %).

Columnas (16): `Código, Clasificación, Curso/Área académica, Material/Bien, Categoría, Tipo/Detalle, Unidad base, Stock anterior, Presentación encontrada, Cantidad de presentaciones, Unidades físicas verificadas, Tipo de conteo, Diferencia, Estado de verificación, Observaciones, N° CAJA`.

- **Clasificación:** Material, Utilería/útiles, Tecnología, Mobiliario, Otros. **Tipo de conteo:** Exacto, Parcial, Estimado, Pendiente. **Estado de verificación:** Verificado, Pendiente de conteo / verificación / clasificación / identificación / prueba.
- **Códigos:** `MAT001…MAT063`, `TEC-001…005`, `MAT-001/002` (globo y mapas), `UTI-001`, `MOB-001/002`, `IND001…003`, `DOC-001`. **Ubicación:** solo N.º de caja (1–29) o "Bolsa".
- **Guía de campo (en el archivo):** el stock anterior es solo referencia; registrar primero la presentación física; contar sin mover; no desenrollar sin autorización; la diferencia se calcula solo si stock anterior y unidades verificadas son numéricos; no colocar cantidades inventadas.

### 4.5 Psicomotricidad (`1dRsrEp8-elDnrMn3bMOvxesPsmRllZqs`)

Hojas: **Inventario General** (`N°, Categoría, Material/Bien, Cantidad, Unidad, Estado, Observaciones`; 22 ítems; 3 filas de plantilla vacías) · **Averiados** (`N°, Material/Bien, Cantidad afectada, Unidad, Condición, Daño o incidencia, Acción recomendada, Observaciones`; 8 filas con datos) · **Conteo Físico** (`Material, Cantidad contada, Unidad, Estado, Observación final, Responsable`; 6 materiales pendientes, vacía).

Estados: Bueno 13 · Regular 4 · Averiado 2 · Por verificar 3. Cantidades con texto: "300 a 400" (pelotas), "22 x 22" (baldosas e insertos EVA).

---

## 5. Auditoría — hallazgos (IDs usados por las tareas)

| ID | Sev. | Hallazgo |
|---|---|---|
| F-01 | Crítico | El proceso no verifica stock ni registra salidas; 12 de 19 ítems con conteo exacto muestran 151 unidades menos que el stock anterior, sin forma de explicarlo |
| F-02 | Crítico | El vale exige firma de Director/Subdirector pero el BPMN solo valida rol en Secretaría; "Entregar materiales" aparece en Secretaría y en Almacén |
| F-03 | Alto | Diferencias de almacén calculadas comparando pliegos con rollos (9 ítems, suma -498); contradice la guía del propio archivo |
| F-04 | Alto | 5 cuentas Gmail personales, archivos con 3 propietarios distintos, sin cuenta institucional; no aparecen supervisores (según el informe) |
| F-05 | Alto | Colisión de códigos: `MAT` = Matemática (biblioteca) y Material (almacén); `MAT001` vs `MAT-001` solo difieren en un guion |
| F-06 | Alto | Psicomotricidad: pelota grande 1 "Bueno" vs 4 "Roto"; aros 10 "Bueno" vs 4 "En piezas"; tallímetro duplicado; tecnopor repetido con almacén. Columpio y casita averiados = riesgo para niños pequeños |
| F-07 | Alto | Laptops: la regla marca "Revisar" si seguridad = "No" (13/13) y exige arranque ≤ 60 s (ninguno) → 0 operativos por diseño; Resumen (8 críticos/7 revisar) ≠ Plan (9 P1/6 P2) por L-022U |
| F-08 | Alto | 6 fallas observadas sin incidencia registrada: adaptador "No" en L-0195, L-014N, L-017Q; micrófono "No" en L-0195 y L-005E; salida de audio "No" en L-0195 |
| F-09 | Alto | Datos provisionales: biblioteca 382 por verificar; almacén 24/77 verificados y ~28 sin dato físico; conteo físico de psicomotricidad vacío |
| F-10 | Medio | Ningún inventario tiene responsable, fecha de revisión ni ubicación precisa (biblioteca "Biblioteca", laptops "LABORATORIO", almacén solo caja) |
| F-11 | Medio | 4 vocabularios de estado distintos y 5 significados de "cantidad" (ejemplares, tomos, presentaciones, rangos, texto) |
| F-12 | Medio | Almacén: "Cantidad de presentaciones" contiene el texto "Verificado"; posibles duplicados (MAT002/MAT037 cola; MAT011/MAT038 papel metálico; papelotes MAT042–044 vs MAT055–063 con 397 rollos); campos numéricos con texto ("½", ".", "Stock antiguo…") |
| F-13 | Medio | Biblioteca: metadatos ausentes (sin año/ISBN/estante/préstamo); modelo de copias mezclado (una fila por ejemplar vs cantidad > 1); colecciones contadas como unidades; datos duplicados entre consolidada y hojas por área |
| F-14 | Medio | Laptops: ceros en lugar de vacíos (RAM/arranque), tipo de disco no registrado, códigos mixtos, un almacenamiento "204,1 GB" y un "x 5" que parecen errores de tipeo |
| F-15 | Medio | Ningún archivo registra quién lo modificó y cuándo |
| F-16 | Bajo | BPMN con marca de agua "Visual Paradigm (evaluation copy)" y eventos duplicados |
| F-17 | Bajo | Filas de plantilla vacías, espacio final en `IND001`, procesador "x 5" |
| F-18 | Bajo | Solo 2 de 6 archivos nombran a la institución |

**Puntos fuertes a conservar:** estructura y códigos de biblioteca; plan de mejora de laptops con prioridad y prueba de validación; guía de campo del almacén (no inventar cantidades); no hay datos personales en la carpeta; el BPMN tiene ruta de rechazo.

---

## 6. Estado del código

**No se encontró código del sistema.** Se revisó: Drive (sin repositorio, `.java`, `.zip` de este proyecto ni archivos de código) y las carpetas locales accesibles (Descargas y `proyecto_acme`). En Descargas hay un `.zip` de otro proyecto ("Nexum Avance 1") que no se revisó ni se asume relacionado.

El informe **no define stack tecnológico**. Si existe un repositorio, la primera tarea es localizarlo y auditarlo (tarea `A-01`).

---

## 7. Decisiones pendientes (con supuesto por defecto para no bloquear)

Cada tarea que depende de una decisión usa el supuesto indicado, lo deja **configurable** y lo registra para validación con la Dirección.

| ID | Decisión | Supuesto por defecto |
|---|---|---|
| D-01 | Niveles de aprobación del vale | Secretaría pre-valida (rol y procedencia); Director o Subdirector aprueba (firma, como exige el vale) |
| D-02 | Política de stock | Stock negativo prohibido; entrega parcial permitida; sin stock mínimo hasta definirlo |
| D-03 | Catálogo oficial de estados | Un catálogo por dominio (ver `A-04`), con "Por verificar" como estado transversal |
| D-04 | Unidades y conversiones | Unidad base por ítem; conversión presentación→unidad solo si se confirma físicamente |
| D-05 | Modelo de ejemplares en biblioteca | Una fila por ejemplar; si `Cantidad` > 1 se expande a N ejemplares; las colecciones de tomos (`ING-047/048`) son una colección con N tomos |
| D-06 | Alcance del mobiliario (`MOB-*`) | Se importa como activo en estado pendiente, sin control de stock |
| D-07 | Criterios de laptops | Seguridad evaluada por actualizaciones al día, cuentas y cifrado (no antivirus); umbrales de arranque parametrizables (por defecto 60 / 120 s) |
| D-08 | Stack | Base relacional (PostgreSQL), API REST con OpenAPI, frontend web; **cambiar si ya existe repositorio** |
| D-09 | Préstamo de biblioteca | Fuera de alcance hasta levantar requisito |
| D-10 | Numeración del vale | Automática y correlativa por año (`V-2026-0001`) |
| D-11 | Identificador global de bien | `<TIPO>-<correlativo>` (`ALM-`, `BIB-`, `EQP-`, `PSI-`, `ACT-`), conservando el código original en `codigo_origen` |
| D-12 | Roles | Administrador, Director, Subdirector, Secretaría, Almacenero, Solicitante (docente/personal), Responsable TI (UTDIT), Psicología (acceso restringido), Consulta |

---

## 8. Glosario mínimo

- **UTDIT:** Unidad de Transformación Digital e Innovación Tecnológica (supervisa a los practicantes).
- **Vale:** documento de requerimiento de materiales y enseres.
- **Presentación:** forma física en que está almacenado un material (rollo, caja, paquete, atado) sin abrirlo.
- **Por verificar:** dato registrado desde fotografías o sin conteo físico confirmado.
- **Cola de revisión:** lista de registros ambiguos o contradictorios que una persona debe resolver; nunca se resuelven automáticamente.

---

## 9. Límites de lo analizado

Se leyeron valores y texto de los archivos, **no** fórmulas, colores ni comentarios de celda; no se verificó si los cálculos automáticos del libro de laptops se aplican como indica. Permisos verificados solo en la carpeta y en el archivo de laptops. Las otras carpetas de módulo no se abrieron. Todo lo atribuido al informe hereda su falta de fiabilidad.
