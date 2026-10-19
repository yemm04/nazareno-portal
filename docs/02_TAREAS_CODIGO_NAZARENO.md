# TAREAS DE CÓDIGO — Sistema Integrado de Gestión Académica y Tecnológica · I.E.P. El Nazareno

> **Requisito previo:** leer `01_CONTEXTO_NAZARENO.md`. Los IDs `F-xx` (hallazgos) y `D-xx` (decisiones con supuesto por defecto) se definen allí.
> **Estado del código:** no se encontró repositorio. Las tareas son de **construcción**; si existe código, ejecutar `TA-01` primero y convertir cada tarea en "mejora" sobre lo existente.
> **Prioridades:** `P0` bloqueante · `P1` primer entregable · `P2` después.
> **Plazo de referencia:** unas 5 semanas desde el 16-oct (cierre del informe ≈ 24-nov); por eso el orden prioriza **vale + almacén + equipos**.

---

## Reglas para quien ejecute (obligatorias)

1. **No inventar datos.** Dato ausente o ambiguo → `NULL` + registro en `revision_pendiente`. Nunca estimar, rellenar ni "arreglar" automáticamente una contradicción.
2. **Importadores idempotentes:** reejecutar no duplica; cada uno emite un reporte (insertados / rechazados / enviados a revisión).
3. **Conservar el origen:** todo registro importado guarda `codigo_origen`, `archivo_origen` y `hoja_origen`.
4. **Datos de prueba:** seeds ficticios o anonimizados. Los inventarios (bienes de la institución) pueden usarse; **nunca** versionar correos, contraseñas, firmas ni datos personales.
5. **Todo cambio de estado o stock genera auditoría** (quién, cuándo, antes/después).
6. **Lo configurable no se codifica fijo:** umbrales, catálogos, reglas de aprobación y formatos van a configuración o tablas (ver decisiones `D-xx`).
7. **Módulo incompleto = modelado y documentado, no entregado a medias** (restricción del informe).
8. Cada tarea cierra con pruebas automáticas de sus criterios de aceptación.

---

## Carriles paralelizables

| Carril | Tareas | Depende de |
|---|---|---|
| A · Fundaciones | TA-01 … TA-09 | — |
| B · Logística (vale) | TB-01 … TB-07 | TA-02, TA-03, TA-04 |
| C · Almacén e inventarios de bienes | TC-01 … TC-04 | TA-02, TA-04, TB-02 |
| D · Equipos tecnológicos | TD-01 … TD-06 | TA-02, TA-04 |
| E · Biblioteca | TE-01 … TE-03 | TA-02, TA-04 |
| F · Psicomotricidad | TF-01 … TF-02 | TA-02, TA-04 |
| G · Reportes y frontend transversal | TG-01 … TG-03 | A, B–F (parcial) |
| H · Otras líneas del informe | TH-01 | — (no codificar aún) |
| I · Calidad, documentación y cierre | TI-01 … TI-04 | todos |

> Nomenclatura: las **tareas** llevan prefijo `T` + letra de carril (`TA-01`, `TB-03`…). Los **hallazgos** del contexto se citan siempre entre corchetes como `[F-xx]` y las **decisiones** como `[D-xx]`; no son tareas.

---

## A · Fundaciones

### TA-01 · Localizar repositorio y fijar stack — P0
- **Hacer:** buscar repositorio existente del proyecto (Git, zip, carpeta local). Si existe: inventariar estructura, dependencias, migraciones, tests y secretos expuestos, y registrar brechas. Si no: crear repositorio con el stack de `[D-08]`.
- **Entregable:** `docs/ADR-001-stack.md` (decisión, alternativas, consecuencias) y estructura base (`/api`, `/web`, `/db`, `/docs`, `/scripts/import`).
- **Aceptación:** el proyecto levanta con un solo comando documentado; `README` con requisitos; ningún secreto en el repositorio (`.env.example` solamente).

### TA-02 · Esquema común de base de datos — P0
- **Hacer:** migraciones versionadas con estas tablas núcleo (nombres sugeridos):
  - `usuario(id, nombre, correo_institucional, activo)`, `rol`, `usuario_rol`, `permiso(recurso, accion)`, `rol_permiso`.
  - `ubicacion(id, tipo[aula|laboratorio|almacen|biblioteca|psicomotricidad|otro], nombre, padre_id)` — modela caja y estante como hijos.
  - `catalogo(dominio, codigo, etiqueta, activo)` — estados, tipos, clasificaciones, prioridades (ver `TA-04`).
  - `unidad_medida(codigo, nombre)`.
  - `auditoria(id, ts, usuario_id, entidad, entidad_id, accion, antes, despues)`.
  - `revision_pendiente(id, entidad, entidad_id, tipo[duplicado_posible|contradiccion|dato_faltante|unidad_incomparable|otro], detalle, estado[abierta|resuelta|descartada], resuelto_por, ts)`.
  - `adjunto(id, entidad, entidad_id, ruta, tipo, ts, usuario_id)` — evidencias (fotos, actas).
- **Aceptación:** migración reversible; FK e índices; `id_global` único entre todos los bienes `[D-11]`; ninguna tabla guarda contraseñas en claro.

### TA-03 · Autenticación y control de acceso por rol (RBAC) — P0
- **Hacer:** login con cuenta institucional; roles de `[D-12]`; permisos por recurso y acción; middleware que **niega por defecto**. Datos de Psicología solo para su rol (y Administrador con registro en auditoría).
- **Aceptación (tests):** Solicitante no puede aprobar vale ni ver otros vales; Almacenero no puede aprobar; Consulta no escribe; acceso denegado queda auditado; intento sobre datos de Psicología sin rol → 403.

### TA-04 · Catálogos unificados y regla de identificadores — P0 · [F-05][F-11]
- **Hacer:** sembrar catálogos (valores abiertos a validación `[D-03]`):

| Dominio | Valores |
|---|---|
| `estado_bien` | Bueno, Regular, Malo, Averiado, Por verificar, Baja |
| `estado_verificacion` | Verificado, Pendiente de conteo, Pendiente de verificación, Pendiente de clasificación, Pendiente de identificación, Pendiente de prueba |
| `tipo_conteo` | Exacto, Parcial, Estimado, Pendiente |
| `clasificacion_almacen` | Material, Utilería/útiles, Tecnología, Mobiliario, Indumentaria, Otros |
| `prioridad_incidencia` | Alta, Media, Baja |
| `estado_incidencia` | Pendiente, En atención, Resuelta, Descartada |
| `estado_vale` | ver `TB-02` |

  Mapear los estados de origen: `Averiado/Roto/En piezas/Mal estado` → `Averiado` (conservando el texto original en observación); `Bueno/Regular/Por verificar` se mantienen.
- **Hacer:** generar `id_global` por tipo (`ALM-`, `BIB-`, `EQP-`, `PSI-`, `ACT-`) con correlativo; `(tipo, codigo_origen)` único para evitar colisiones (ej. `MAT001` ≠ `MAT-001` ≠ `MAT-001` de biblioteca).
- **Aceptación:** ningún importador puede crear dos bienes con el mismo `id_global`; el catálogo se edita sin tocar código.

### TA-05 · Auditoría y trazabilidad transversal — P0 · [F-15]
- **Hacer:** registrar automáticamente en `auditoria` cada alta, edición, cambio de estado y movimiento de stock; incluir `usuario_id` y `ts`; vista de historial por entidad.
- **Aceptación:** editar cualquier campo de bien, vale o equipo deja una fila con `antes/despues`; la auditoría es de solo lectura desde la API.

### TA-06 · Seed de datos de prueba y política de datos reales — P1
- **Hacer:** script de seed con datos ficticios (usuarios, vales) y carga de los inventarios reales de bienes como **dataset de desarrollo** (sin datos personales). Variable de entorno `DATA_MODE=dev|real`; en `real` exigir confirmación explícita.
- **Aceptación:** el repositorio no contiene correos ni firmas reales; `DATA_MODE=real` no corre sin flag de autorización.

### TA-07 · Estándar de API, validación y errores — P1
- **Hacer:** API REST documentada en OpenAPI; paginación y filtros comunes; validación de entrada centralizada; errores con código y mensaje en español; versionado `/api/v1`.
- **Aceptación:** `GET /api/v1/docs` publica el contrato; toda ruta tiene esquema de entrada/salida.

### TA-08 · Configuración parametrizable — P1
- **Hacer:** tabla `configuracion(clave, valor, descripcion)` para: umbrales de arranque, niveles de aprobación `[D-01]`, política de stock `[D-02]`, formato de numeración `[D-10]`, nombre e identidad institucional para reportes.
- **Aceptación:** cambiar un umbral recalcula la clasificación sin redeploy.

### TA-09 · Respaldo y seguridad base — P1
- **Hacer:** hash de contraseñas con algoritmo moderno, sesiones con expiración, HTTPS en despliegue, backup diario de la BD con prueba de restauración documentada, secretos solo por entorno.
- **Aceptación:** restauración probada en un entorno limpio; escaneo de dependencias sin vulnerabilidades críticas.

---

## B · Módulo Logística — proceso de requerimiento (vale)

### TB-01 · Rediseño del proceso (BPMN v2) — P0 · [F-01][F-02][F-16]
- **Hacer:** rehacer el diagrama y alinear el vale con él (herramienta con exportación limpia, sin marca de agua). Cambios obligatorios:
  1. Quitar la tarea "Entregar materiales" de Secretaría; reemplazarla por *autorizar y derivar a Almacén* `[D-01]`.
  2. Añadir paso de **aprobación por Director/Subdirector** (el vale ya exige su firma).
  3. Añadir en Almacén: *verificar stock* con tres salidas (stock suficiente → entrega total; insuficiente → entrega parcial o pendiente; sin stock → rechazo con motivo).
  4. Añadir *registrar movimiento de stock* tras cada entrega.
  5. Añadir *asignar N.º de vale automáticamente* `[D-10]` y *archivar vale firmado*.
  6. Unificar eventos de inicio/fin (uno de inicio, fines distintos: `Completado`, `Rechazado`, `Cancelado`).
- **Entregable:** `docs/bpmn/requerimiento-materiales-v2.bpmn` + PNG + tabla de decisiones de gateway.
- **Aceptación:** cada tarea del diagrama corresponde a una transición o endpoint de `TB-02`/`TB-03`.

### TB-02 · Modelo de datos y máquina de estados del vale — P0 · [F-01]
- **Tablas:**
  - `vale(id, numero UNIQUE, fecha, solicitante_id, cargo_area, estado, motivo_rechazo, aprobado_por, fecha_aprobacion, entregado_por, fecha_entrega, recibido_por, fecha_recepcion)`.
  - `vale_item(id, vale_id, orden, item_almacen_id NULL, descripcion_libre, cantidad_solicitada, unidad, uso, cantidad_entregada)`; `item_almacen_id` nulo permite pedir algo aún no catalogado.
  - `movimiento_stock(id, item_almacen_id, fecha, tipo[entrada|salida|ajuste], cantidad, unidad, vale_id NULL, conteo_id NULL, responsable_id, motivo)`.
- **Estados y transiciones (con rol autorizado):**

| De → A | Rol |
|---|---|
| BORRADOR → ENVIADO | Solicitante |
| ENVIADO → PREVALIDADO / RECHAZADO | Secretaría |
| PREVALIDADO → APROBADO / RECHAZADO | Director o Subdirector |
| APROBADO → EN_ALMACEN | Secretaría (deriva) |
| EN_ALMACEN → ENTREGADO_PARCIAL / ENTREGADO / RECHAZADO (sin stock) | Almacenero |
| ENTREGADO\* → CERRADO | Solicitante (firma receptor) |
| BORRADOR/ENVIADO → CANCELADO | Solicitante |

- **Aceptación:** transición no listada → error; `numero` correlativo único por año; un vale `RECHAZADO` exige `motivo_rechazo`.

### TB-03 · API del flujo — P0
- **Endpoints mínimos:** `POST /vales`, `PUT /vales/{id}` (solo en BORRADOR), `POST /vales/{id}/enviar|prevalidar|aprobar|rechazar|derivar|entregar|firmar-recepcion|cancelar`, `GET /vales?estado=&solicitante=&desde=&hasta=`, `GET /vales/{id}/pdf`.
- **Reglas:** validar rol por transición (`TA-03`); `entregar` recibe `cantidad_entregada` por ítem y rechaza si supera lo solicitado o el stock `[D-02]`.
- **Aceptación (tests):** solicitar 10 con stock 6 → entrega parcial de 6 y vale queda `ENTREGADO_PARCIAL` con saldo 4; un usuario sin rol recibe 403; cada transición auditada.

### TB-04 · Reglas de stock — P0 · [F-01][F-03]
- **Hacer:** `stock_actual` derivado de la suma de `movimiento_stock` (no editable a mano). Toda salida por vale genera movimiento `salida` ligado a `vale_id`. Stock negativo prohibido `[D-02]`. Ajustes solo vía conteo (`TC-02`) con motivo.
- **Aceptación:** recalcular stock desde movimientos coincide con el campo de consulta; no existe endpoint que altere stock directamente.

### TB-05 · Generación del vale imprimible (PDF) — P1
- **Hacer:** plantilla con los campos del formato actual **más** área/cargo del solicitante, unidad por ítem, firma del almacenero y motivo de rechazo cuando aplique; paginar cuando haya más de 5 ítems; encabezado institucional desde configuración.
- **Aceptación:** el PDF de un vale con 12 ítems sale en 3 filas-páginas coherentes; todos los campos del formato original están presentes.

### TB-06 · Pantallas del flujo por rol — P1
- **Hacer:** *Solicitante:* mis vales, nuevo vale, seguimiento. *Secretaría:* bandeja por prevalidar y por derivar. *Director/Subdirector:* bandeja por aprobar. *Almacenero:* bandeja por entregar, formulario de entrega parcial/total. Todos: detalle con historial de estados.
- **Aceptación:** cada rol ve solo sus bandejas; botones deshabilitados fuera de su transición.

### TB-07 · Matriz de quién puede pedir qué — P2 · [F-02]
- **Hacer:** tabla `politica_solicitud(rol, clasificacion_almacen, requiere_aprobacion, tope_cantidad NULL)` para materializar "verificar rol del solicitante"; editable por Administrador.
- **Aceptación:** una solicitud fuera de política queda `RECHAZADO` automáticamente con motivo.

---

## C · Almacén e inventarios de bienes

### TC-01 · Importador de Inventario de Almacén — P0 · [F-05][F-12][F-12]
- **Origen:** `Inventario Almacen 2026 14 - 10 .xlsx` (77 filas, 16 columnas).
- **Tablas:** `item_almacen(id, id_global, codigo_origen, clasificacion, area_curso, nombre, categoria, detalle, unidad_base, stock_actual, caja, estado_verificacion, observaciones)` y `presentacion(item_id, nombre, factor_a_unidad_base NULL)`.
- **Reglas de limpieza:**
  - `Stock anterior`: numérico → `stock_anterior`; `-`, vacío o `.` → `NULL`; `½` → `0.5`; texto ("Stock antiguo, estimado superior a 1000 unidades") → `stock_anterior_texto` + revisión.
  - `Cantidad de presentaciones`: si contiene texto (Verificado/Pendiente…) **no es cantidad**; descartarla como cantidad y usar su valor solo para validar contra `Estado de verificación`; guardar `NULL`.
  - `N° CAJA`: `"1 y 2"` → cajas `[1,2]`; `"Bolsa"` → sin caja y presentación bolsa; `ubicacion` de tipo caja bajo `almacen`.
  - Códigos: recortar espacios (`"IND001 "`); `MAT-001`/`MAT-002` (globo, mapas) se importan con `codigo_origen` propio.
  - `Tipo de conteo` ∈ {Exacto, Parcial, Estimado, Pendiente} → catálogo `TA-04`.
- **Cola de revisión (no resolver solo):** duplicados posibles `MAT002`/`MAT037` (cola sintética, 16 frascos), `MAT011`/`MAT038` (papel metálico), papelotes `MAT042–044` vs `MAT055–063` (397 rollos, doble clasificación Material/Utilería); ítems con presentación en rollo y unidad base en pliego sin factor de conversión; ~28 ítems sin dato físico.
- **Aceptación:** 77 filas procesadas (importadas + enviadas a revisión = 77); 24 con `estado_verificacion = Verificado`; ninguna cifra inventada; reimportar no duplica.

### TC-02 · Conteo físico con diferencia confiable — P0 · [F-03][F-09]
- **Tablas:** `conteo_sesion(id, fecha, responsable_id, ubicacion_id, estado[abierta|cerrada])`, `conteo_linea(sesion_id, item_id, presentacion, cantidad_presentaciones NULL, unidades_verificadas NULL, tipo_conteo, caja, observacion)`.
- **Regla central:** `diferencia = unidades_verificadas − stock_anterior` **solo si** `tipo_conteo = Exacto` **y** la unidad contada coincide con `unidad_base`; en cualquier otro caso `diferencia = NULL` y el motivo queda visible ("unidad incomparable", "conteo parcial"). Cerrar sesión genera `ajuste` en `movimiento_stock` solo para líneas con diferencia válida y motivo.
- **Aceptación (tests):** línea de 34 rollos contra stock de 250 pliegos → `diferencia = NULL` y entra a `revision_pendiente`; línea exacta 3 vs stock 7 → `diferencia = -4`; el cierre de sesión no ajusta líneas `Parcial`.
- **Verificación con datos reales:** de los 28 valores de "Diferencia" originales deben quedar **18 válidos** (conteo exacto), **9 anulados** por unidad incomparable o conteo parcial (suman -498 de diferencia falsa) y **1 en revisión** (`MAT003`: figura Verificado pero con tipo de conteo Pendiente).

### TC-03 · Bandeja de resolución de revisiones — P1 · [F-09][F-12]
- **Hacer:** pantalla y API para ver `revision_pendiente`, filtrar por tipo y entidad, resolver (fusionar duplicado, confirmar dato, descartar) con comentario; la resolución queda auditada.
- **Aceptación:** fusionar dos ítems duplicados conserva ambos `codigo_origen` como alias y no pierde movimientos.

### TC-04 · Vínculo entre inventarios del mismo bien — P2 · [F-06]
- **Hacer:** relación `bien_equivalente(id_a, id_b, motivo)` para marcar el mismo objeto físico en dos inventarios (por ejemplo, tecnopor en almacén y en psicomotricidad); alerta cuando el mismo bien figura en dos ubicaciones.
- **Aceptación:** el reporte de inventario consolidado cuenta el bien una sola vez.

---

## D · Equipos tecnológicos (hardware y soporte)

### TD-01 · Modelo de equipos, diagnóstico e intervención — P0
- **Tablas:**
  - `equipo(id, id_global, etiqueta_fisica, codigo_origen, tipo, marca, modelo, serie, ubicacion_id, cpu_texto, ram_gb NULL, almacenamiento_gb NULL, tipo_disco NULL, so, so_version)`.
  - `diagnostico(id, equipo_id, fecha, responsable_id, arranque_s NULL, apagado_s NULL, estado_fisico, rendimiento, componentes JSON, actualizado_al_dia, clasificacion, accion_requerida)`.
  - `incidencia(id, equipo_id, componente, descripcion, prioridad, intervencion_sugerida, estado, origen[manual|derivada_diagnostico], fecha, resuelta_en)`.
  - `intervencion(id, equipo_id, incidencia_id NULL, descripcion, responsable_id, fecha_inicio, fecha_fin, resultado_prueba, evidencia_adjunto_id, estado_posterior)`.
- **Aceptación:** `ram_gb`, `arranque_s` y demás medidas vacías son `NULL`, nunca `0` `[F-14]`.

### TD-02 · Importador de laptops — P0 · [F-14]
- **Origen:** `Inventario Laptops 2026.xlsx` (hojas Inventario, Incidencias, Plan de mejora).
- **Reglas:**
  - `código` original → `codigo_origen` (sin corregir formato); `LAB-01…LAB-15` → `etiqueta_fisica`.
  - Almacenamiento: coma decimal (`"1,0 TB"` → 1000 GB; `"240,1 GB"` → 240.1); `"204,1 GB"` se importa tal cual y va a revisión como posible tipeo.
  - CPU `x 5` (L-003C) → revisión por posible tipeo; conservar `cpu_texto` original.
  - Sí/No → booleano; vacío → `NULL`; `0` de RAM/arranque en el Plan de mejora → `NULL`.
  - Equipos protegidos (L-022U, L-021U): estado `Sin diagnóstico`, sin acceder con credenciales propias (restricción del informe).
  - Incidencias: importar las 36 con `origen = manual`.
- **Aceptación:** 15 equipos y 36 incidencias importados; los 2 equipos sin acceso quedan marcados `Sin diagnóstico`, no `Operativo`.

### TD-03 · Motor de clasificación parametrizable — P0 · [F-07]
- **Hacer:** función pura `clasificar(diagnostico, config)` que devuelve `{estado: Operativo|Revisar|Crítico|Sin diagnóstico, acciones[], motivos[]}` guardando los motivos. Reglas por defecto = las del archivo, con estos cambios `[D-07]`:
  - *Crítico:* estado físico o rendimiento Malo, pantalla no operativa, arranque > `boot_max` (120 s).
  - *Revisar:* estado Regular, arranque entre `boot_ok_max` (60 s) y `boot_max`, componente con "No", **o actualizaciones pendientes**. Seguridad deja de evaluarse como "antivirus: No" y pasa a *actualizado al día / cuentas / cifrado*.
  - *Sin diagnóstico:* faltan datos esenciales.
  - Prioridad (`P1/P2/P3`) **derivada del estado**, no capturada aparte, para eliminar la contradicción Resumen vs Plan.
- **Aceptación (tests):** con la configuración original reproduce 8 críticos y 7 por revisar; L-022U cae en `Sin diagnóstico` (no `Revisar`/`P1` según la hoja); con `boot_ok_max` más alto aparecen equipos `Operativo`; Resumen y Plan salen de la misma consulta.

### TD-04 · Incidencias derivadas del diagnóstico — P1 · [F-08]
- **Hacer:** al guardar un diagnóstico, si un componente está en "No" y no existe incidencia abierta para él, crear `incidencia` con `origen = derivada_diagnostico` y estado `Pendiente`, **marcada "por confirmar"** hasta que el técnico la valide.
- **Verificación con datos reales:** genera 6 incidencias: adaptador (L-0195, L-014N, L-017Q), micrófono (L-0195, L-005E), salida de audio (L-0195). No generar por Bluetooth "No" en HP/Dell (probable ausencia de hardware).
- **Aceptación:** no duplica si ya hay incidencia abierta del mismo componente.

### TD-05 · Seguimiento de intervención con evidencia — P1
- **Hacer:** flujo `Pendiente → En atención → Resuelta`; al resolver exigir fecha, responsable, resultado de la **prueba estándar** (encender → 5 pestañas de navegador → Writer → Calc → alternar 5–10 min) y adjunto opcional; calcular `estado_posterior`.
- **Aceptación:** una incidencia no pasa a `Resuelta` sin resultado de prueba; el cambio queda auditado.

### TD-06 · Pantallas de equipos — P1
- **Hacer:** lista filtrable (prioridad, ubicación, componente), ficha del equipo con historial, tablero de incidencias abiertas, plan de mejora ordenado por prioridad. Coordinar con UTDIT antes de ejecutar cambios que afecten el servicio (restricción del informe).
- **Aceptación:** la vista "Plan de mejora" sale de la base, no de una hoja aparte.

---

## E · Biblioteca

### TE-01 · Modelo de obra, ejemplar y colección — P0 · [F-13][D-05]
- **Tablas:** `obra(id, titulo NULL, autor NULL, editorial NULL, area, tipo_material, tema)`, `ejemplar(id, id_global, codigo_origen, obra_id, tomo NULL, numero_ejemplar, estado, verificado BOOL, ubicacion_id, estante NULL, codigo_anterior NULL, observaciones)`, `coleccion(id, nombre, total_tomos)`.
- **Aceptación:** una obra con 3 copias = 1 `obra` + 3 `ejemplar`; una colección de 20 tomos = 1 `coleccion` con `total_tomos = 20`, no 20 ejemplares sueltos.

### TE-02 · Importador de la hoja consolidada — P0 · [F-09][F-13]
- **Origen:** hoja `Biblioteca General` como **única fuente**; las hojas por área se usan solo para validar conteos, no para cargar.
- **Reglas:**
  - Autor/editorial/tomo `—`, `No visible`, `No indica`, `Varios`, vacío → `NULL` (conservar el texto en observación si aporta).
  - `Estado = Por verificar` → `verificado = false`; Bueno/Regular se mantienen.
  - Título `—` con nota "título no legible" → `titulo = NULL` + revisión.
  - `Cantidad > 1` → expandir según `[D-05]`; `ING-047` (20) e `ING-048` (50) → `coleccion` por tratarse de tomos.
  - `Código anterior` (21 filas de Arte y Cultura) → `codigo_anterior`; **no usarlo como clave** (`ART-001` aparece como anterior de dos ítems).
  - `Ubicación = Biblioteca` → ubicación raíz; `estante = NULL`.
- **Aceptación:** 1.290 filas procesadas; ejemplares + colecciones reproducen 1.518 unidades menos el ajuste de las 2 colecciones (documentar la diferencia); 382 con `verificado = false`; reimportar no duplica.

### TE-03 · Búsqueda, verificación y metadatos — P1
- **Hacer:** búsqueda por título/autor/área/estado, vista "pendientes de verificar" por área (Ciencias Sociales 75 % y Arte 57 % primero), edición de estante, año, ISBN y estado con auditoría. Préstamo **fuera de alcance** `[D-09]`; dejar el modelo preparado (`ejemplar` ya es la unidad prestable) pero sin pantallas.
- **Aceptación:** marcar un ejemplar como verificado actualiza el indicador por área.

---

## F · Psicomotricidad

### TF-01 · Modelo e importador — P0 · [F-06]
- **Origen:** `Inventario_Psicomotricidad_Actualizado.xlsx` (22 ítems, 8 filas de averiados, 6 en conteo físico).
- **Tabla:** `activo(id, id_global, tipo, nombre, categoria, area, ubicacion_id, cantidad_min, cantidad_max, cantidad_texto, unidad, estado, retirar_de_uso BOOL, observaciones)`.
- **Reglas:**
  - `"300 a 400"` → `cantidad_min=300`, `cantidad_max=400`, `aproximada`.
  - `"22 x 22"` → `cantidad_texto` + revisión (puede ser medida o cantidad); **no multiplicar**.
  - Estado `Averiado/Roto/En piezas/Mal estado` → `Averiado` + `retirar_de_uso = true` (por defecto, por seguridad infantil).
  - Descartar las 3 filas de plantilla vacías.
- **Cola de revisión:** pelota grande (1 Bueno vs 4 Roto), aros (10 Bueno vs 4 En piezas, además pendientes de conteo), tallímetro duplicado (ítems 16 y 20), tecnopor/paneles de espuma vs almacén (`TC-04`), columpio en dos filas.
- **Aceptación:** 22 ítems procesados; columpio y casita con `retirar_de_uso = true` y visibles en una alerta de seguridad; ninguna contradicción resuelta automáticamente.

### TF-02 · Conteo físico y responsables — P1 · [F-09][F-10]
- **Hacer:** reutilizar `conteo_sesion`/`conteo_linea` (`TC-02`) para estos 6 materiales pendientes; exigir `responsable_id` y fecha antes de cerrar la sesión.
- **Aceptación:** la sesión no se cierra sin responsable; el cierre actualiza estado de los ítems verificados.

---

## G · Reportes y frontend transversal

### TG-01 · Reportes e indicadores — P1 (informe, línea 6)
- **Indicadores mínimos** (cada uno con consulta, filtro por fecha/ubicación y exportación PDF y XLSX con plantilla institucional):

| Módulo | Indicador |
|---|---|
| Vales | por estado; tiempo promedio de atención; rechazos por motivo; atendidos parcialmente |
| Almacén | stock por ítem y caja; faltantes verificados; ítems sin verificar (%); movimientos por periodo |
| Equipos | por clasificación y prioridad; incidencias abiertas por componente; intervenciones resueltas |
| Biblioteca | ejemplares por área y estado; % verificado |
| Psicomotricidad | bienes por estado; retirados de uso |
| Calidad de datos | registros en `revision_pendiente` por tipo |

- **Aceptación:** los totales coinciden con las cifras de la sección 4 del contexto tras importar (p. ej. 15 equipos, 36 incidencias, 77 ítems de almacén).

### TG-02 · Navegación y vistas por perfil — P1
- **Hacer:** menú generado desde permisos (`TA-03`); un panel de inicio por rol; búsqueda global por `id_global` o `codigo_origen`.
- **Aceptación:** un Solicitante no ve entradas de menú de Almacén ni de Equipos.

### TG-03 · Exportación e importación auditada — P2
- **Hacer:** exportar listados a XLSX; permitir reimportar una hoja corregida por el responsable pasando por las mismas reglas de limpieza y registrando el origen.
- **Aceptación:** la reimportación de una hoja corregida actualiza registros existentes por `codigo_origen` sin duplicarlos.

---

## H · Otras líneas del informe — sin codificar todavía

### TH-01 · Levantamiento de requerimientos — P1 · (no es código)
- **Alcance:** Director, Subdirección, Psicología, Secretaría (carpetas ya existentes en el Drive, no auditadas) y las líneas 2–5 del informe.
- **Hacer:** por cada módulo, entrevista y acta; mapa de procesos; lista de datos y roles; qué información es sensible; y recién entonces tareas de código en este mismo formato.
- **Regla:** **no escribir modelos ni pantallas** de estos módulos sin acta de validación (restricción del informe). Mientras tanto reutilizan solo lo común (`TA-02`, `TA-03`, `TA-05`).
- **Aceptación:** por módulo existe acta + mapa de necesidades + decisión de alcance (incluido / modelado y documentado / fuera).

---

## I · Calidad, documentación y cierre

### TI-01 · Pruebas automáticas — P0 (continuo)
- **Cobertura mínima:** máquina de estados del vale (todas las transiciones válidas e inválidas); permisos por rol; cálculo de stock desde movimientos; regla de diferencia (`TC-02`); motor de clasificación (`TD-03`); idempotencia de cada importador con los conteos esperados.
- **Aceptación:** CI ejecuta todo en cada cambio; los importadores se prueban con los archivos reales como fixtures anonimizados.

### TI-02 · Documentación técnica — P1
- **Entregables:** `README`, diagrama entidad-relación, BPMN v2, tabla de roles y permisos, diccionario de datos por tabla, mapa de importadores (columna origen → campo destino), guía de despliegue y restauración.
- **Aceptación:** alguien ajeno al equipo levanta el proyecto siguiendo solo la documentación.

### TI-03 · Manuales y demostración — P1
- **Entregables:** manual breve por rol (Solicitante, Secretaría, Aprobador, Almacenero, Responsable TI) con capturas; guion de demostración del flujo completo de un vale hasta el cierre y de un diagnóstico de laptop hasta resolver la incidencia.
- **Aceptación:** la demo se ejecuta de punta a punta con datos de prueba.

### TI-04 · Traspaso y gobierno de accesos — P0 · (coordinar con UTDIT, fuera del código) · [F-04]
- **Hacer:** mover la carpeta `MODULO-LOGISTICA` y el repositorio a una cuenta institucional con **un propietario único**; dar acceso a supervisión (UTDIT) y a Subdirección; reemplazar las cuentas Gmail personales por institucionales; documentar quién puede editar qué.
- **Aceptación:** ningún archivo ni repositorio queda con propietario personal; la lista de accesos está documentada y aprobada.

---

## Orden de ejecución recomendado

1. **Semana 1:** `TA-01`, `TA-02`, `TA-03`, `TA-04`, `TA-05`, `TI-04` (en paralelo) · decisiones `[D-01]…[D-12]` validadas o aceptadas por defecto.
2. **Semana 2:** `TB-01`, `TB-02`, `TB-03`, `TB-04`, `TC-01`, `TC-02`, `TD-01`, `TD-02`, `TD-03`.
3. **Semana 3:** `TB-05`, `TB-06`, `TC-03`, `TD-04`, `TD-05`, `TE-01`, `TE-02`, `TF-01`.
4. **Semana 4:** `TD-06`, `TE-03`, `TF-02`, `TG-01`, `TG-02`, `TA-06…TA-09`, `TH-01`.
5. **Semana 5:** `TI-01…TI-03`, `TC-04`, `TB-07`, `TG-03`, cierre y entrega. Lo que no alcance madurez queda modelado y documentado.

---

## Definición de "terminado" (global)

- Cada tarea cumple sus criterios de aceptación con prueba automática.
- Ningún dato personal ni secreto en el repositorio.
- Toda contradicción de los datos de origen está en `revision_pendiente`, no resuelta en silencio.
- Los totales de los reportes coinciden con las cifras verificadas en la sección 4 del contexto.
- Lo no terminado queda documentado como "modelado, no implementado", con su motivo.
