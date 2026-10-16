import { ROLES } from '../constants/roles'

export const AREAS = ['Tecnología', 'Administración', 'Psicología']

export const mockMembers = [
  { id: 1, codigo: 'P2601', nombre: 'Camila Fiorella', apellido: 'Huamán Torres', dni: '75841203', genero: 'Femenino', fechaNacimiento: '2003-05-14', telefono: '987654321', direccion: 'Av. Los Álamos 245, Chimbote', rol: ROLES.PRACTICANTE.id, area: 'Tecnología', fechaIngreso: '2026-03-10', estado: 'ACTIVO' },
  { id: 2, codigo: 'P2602', nombre: 'Diego Alonso', apellido: 'Vargas Ruiz', dni: '76932014', genero: 'Masculino', fechaNacimiento: '2002-11-02', telefono: '987654322', direccion: 'Jr. Las Begonias 118, Chimbote', rol: ROLES.PRACTICANTE.id, area: 'Tecnología', fechaIngreso: '2026-03-10', estado: 'ACTIVO' },
  { id: 3, codigo: 'P2603', nombre: 'Rodrigo Sebastián', apellido: 'Chumpitaz León', dni: '74625198', genero: 'Masculino', fechaNacimiento: '2003-01-27', telefono: '987654323', direccion: 'Calle Grau 302, Nvo. Chimbote', rol: ROLES.PRACTICANTE.id, area: 'Tecnología', fechaIngreso: '2026-04-02', estado: 'ACTIVO' },
  { id: 4, codigo: 'P2604', nombre: 'Valeria Nicole', apellido: 'Espinoza Quiroz', dni: '77103456', genero: 'Femenino', fechaNacimiento: '2003-08-19', telefono: '987654324', direccion: 'Urb. Buenos Aires Mz. B Lt. 5, Nvo. Chimbote', rol: ROLES.PRACTICANTE.id, area: 'Administración', fechaIngreso: '2026-04-15', estado: 'ACTIVO' },
  { id: 5, codigo: 'C2601', nombre: 'Milagros Elena', apellido: 'Cárdenas Ponce', dni: '45298761', genero: 'Femenino', fechaNacimiento: '1990-06-30', telefono: '987654325', direccion: 'Av. Pardo 550, Nvo. Chimbote', rol: ROLES.COORDINADOR.id, area: 'Tecnología', fechaIngreso: '2025-01-08', estado: 'ACTIVO' },
  { id: 6, codigo: 'C2602', nombre: 'Renzo Gabriel', apellido: 'Ortega Salas', dni: '43871209', genero: 'Masculino', fechaNacimiento: '1988-09-12', telefono: '987654326', direccion: 'Urb. Buenos Aires Mz. C Lt. 9, Nvo. Chimbote', rol: ROLES.COORDINADOR.id, area: 'Psicología', fechaIngreso: '2025-02-20', estado: 'ACTIVO' },
]