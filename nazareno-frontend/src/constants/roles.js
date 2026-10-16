export const ROLES = {
  PRACTICANTE: {
    id: 'PRACTICANTE',
    label: 'Practicante',
    prefix: 'P',
    badgeClass: 'bg-purple-100 text-purple-800',
  },
  COORDINADOR: {
    id: 'COORDINADOR',
    label: 'Coordinador',
    prefix: 'C',
    badgeClass: 'bg-amber-100 text-amber-800',
  },
  ADMIN: {
    id: 'ADMIN',
    label: 'Administrador',
    prefix: 'A',
    badgeClass: 'bg-red-100 text-red-800',
  },
}

export const ROLE_LIST = [ROLES.PRACTICANTE, ROLES.COORDINADOR]

export function getRoleByCodigo(codigo) {
  const prefix = codigo?.charAt(0)?.toUpperCase()
  return Object.values(ROLES).find((r) => r.prefix === prefix) || null
}