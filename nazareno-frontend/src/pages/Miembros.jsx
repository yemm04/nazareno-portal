import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Search, UserPlus, Pencil, Trash2 } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { ROLES, ROLE_LIST } from '../constants/roles'
import { AREAS } from '../data/mockMembers'
import { formatFecha } from '../utils/dates'

export default function Miembros() {
  const { members, loading, removeMember } = useMembers()
  const location = useLocation()
  const [successMsg, setSuccessMsg] = useState(location.state?.creado || null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('TODOS')
  const [areaFilter, setAreaFilter] = useState('TODAS')

  if (loading) {
    return <p className="text-center text-gray-400 py-20">Cargando miembros...</p>
  }

  const filtered = members.filter((m) => {
    const fullName = `${m.nombre} ${m.apellido}`.toLowerCase()
    const term = search.toLowerCase()
    const matchesSearch = fullName.includes(term) || m.dni.includes(search) || m.codigo.toLowerCase().includes(term)
    const matchesRole = roleFilter === 'TODOS' || m.rol === roleFilter
    const matchesArea = areaFilter === 'TODAS' || m.area === areaFilter
    return matchesSearch && matchesRole && matchesArea
  })

  const handleDelete = async (member) => {
    if (window.confirm(`¿Eliminar a ${member.nombre} ${member.apellido} del sistema?`)) {
      try {
        await removeMember(member.id)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  return (
    <>
      {successMsg && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3 mb-5">
          <span>Miembro <strong>{successMsg}</strong> registrado correctamente.</span>
          <button onClick={() => setSuccessMsg(null)} className="text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Miembros</h1>
          <p className="text-sm text-gray-400">{members.length} miembros registrados</p>
        </div>
        <Link to="/miembros/nuevo" className="flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          <UserPlus size={16} />
          Nuevo Miembro
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5 mt-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI o código..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600">
          <option value="TODOS">Todos los roles</option>
          {ROLE_LIST.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600">
          <option value="TODAS">Todas las áreas</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Miembro</th>
              <th className="px-5 py-3 font-medium">Código</th>
              <th className="px-5 py-3 font-medium">DNI</th>
              <th className="px-5 py-3 font-medium">Rol</th>
              <th className="px-5 py-3 font-medium">Área</th>
              <th className="px-5 py-3 font-medium">F. Ingreso</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const role = ROLES[m.rol]
              return (
                <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-bold">
                        {m.nombre.charAt(0)}{m.apellido.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{m.nombre} {m.apellido}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{m.codigo}</td>
                  <td className="px-5 py-3 text-gray-500">{m.dni}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${role.badgeClass}`}>{role.label}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{m.area}</td>
                  <td className="px-5 py-3 text-gray-500">{formatFecha(m.fechaIngreso)}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">{m.estado}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/miembros/${m.id}/editar`} className="text-gray-400 hover:text-purple-800" title="Editar">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(m)} className="text-gray-400 hover:text-red-600" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">No se encontraron miembros con esos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}