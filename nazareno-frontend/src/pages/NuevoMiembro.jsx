import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { ROLE_LIST } from '../constants/roles'
import { AREAS } from '../data/mockMembers'

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800'
const inputDisabledClass = 'bg-gray-100 text-gray-500 cursor-not-allowed'

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}

const emptyForm = {
  nombre: '', apellido: '', dni: '', fechaNacimiento: '', genero: '', telefono: '', direccion: '',
  rol: '', area: '', fechaIngreso: '',
}

export default function NuevoMiembro() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const { addMember, updateMember, members } = useMembers()

  const [form, setForm] = useState(emptyForm)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditMode) return
    const existente = members.find((m) => String(m.id) === id)
    if (existente) {
      setForm({
        nombre: existente.nombre || '',
        apellido: existente.apellido || '',
        dni: existente.dni || '',
        fechaNacimiento: existente.fechaNacimiento || '',
        genero: existente.genero || '',
        telefono: existente.telefono || '',
        direccion: existente.direccion || '',
        rol: existente.rol || '',
        area: existente.area || '',
        fechaIngreso: existente.fechaIngreso || '',
      })
    }
  }, [isEditMode, id, members])

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(emptyForm).some((field) => !form[field])) {
      setError('Completa todos los campos obligatorios.')
      return
    }
    setSaving(true)
    try {
      if (isEditMode) {
        await updateMember(id, form)
        navigate('/miembros', { state: { creado: `${form.nombre} ${form.apellido} actualizado correctamente.` } })
      } else {
        const nuevo = await addMember(form)
        navigate('/miembros', { state: { creado: `${nuevo.codigo} - ${nuevo.nombre} ${nuevo.apellido}` } })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Link to="/miembros" className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-900 mb-4">
        <ArrowLeft size={16} />
        Volver a Miembros
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{isEditMode ? 'Editar Miembro' : 'Nuevo Miembro'}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {isEditMode ? 'Actualiza los datos del practicante o coordinador.' : 'Completa la ficha del practicante o coordinador.'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-3xl space-y-8">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <section>
          <h2 className="font-bold text-gray-900 mb-1">Datos Personales</h2>
          <p className="text-sm text-gray-400 mb-4">Identidad y datos de contacto.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre *"><input value={form.nombre} onChange={handleChange('nombre')} className={inputClass} /></Field>
            <Field label="Apellido *"><input value={form.apellido} onChange={handleChange('apellido')} className={inputClass} /></Field>
            <Field label="DNI *"><input value={form.dni} onChange={handleChange('dni')} className={inputClass} /></Field>
            <Field label="Género *">
              <select value={form.genero} onChange={handleChange('genero')} className={inputClass}>
                <option value="">Seleccionar</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </Field>
            <Field label="Fecha de Nacimiento *"><input type="date" value={form.fechaNacimiento} onChange={handleChange('fechaNacimiento')} className={inputClass} /></Field>
            <Field label="Teléfono *"><input value={form.telefono} onChange={handleChange('telefono')} className={inputClass} /></Field>
            <Field label="Dirección *" full><input value={form.direccion} onChange={handleChange('direccion')} className={inputClass} /></Field>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-1">Datos del Portal</h2>
          <p className="text-sm text-gray-400 mb-4">
            {isEditMode ? 'El rol no se edita aquí — implica reglas aparte (código, permisos).' : 'Rol, área y fecha de ingreso — de aquí sale el código de acceso.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Rol *">
              <select
                value={form.rol}
                onChange={handleChange('rol')}
                disabled={isEditMode}
                className={`${inputClass} ${isEditMode ? inputDisabledClass : ''}`}
              >
                <option value="">Seleccionar rol</option>
                {ROLE_LIST.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </Field>
            <Field label="Área *">
              <select value={form.area} onChange={handleChange('area')} className={inputClass}>
                <option value="">Seleccionar área</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Fecha de Ingreso *">
              <input
                type="date"
                value={form.fechaIngreso}
                onChange={handleChange('fechaIngreso')}
                disabled={isEditMode}
                className={`${inputClass} ${isEditMode ? inputDisabledClass : ''}`}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-1">Foto de Perfil</h2>
          <p className="text-sm text-gray-400 mb-4">Opcional — vista previa local, la subida real se conecta cuando tengamos backend.</p>
          <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-purple-400">
            {fotoPreview
              ? <img src={fotoPreview} alt="Vista previa" className="w-full h-full object-cover" />
              : <span className="text-xs text-gray-400 text-center px-2">Subir foto</span>}
            <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </label>
        </section>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Link to="/miembros" className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={saving} className="bg-purple-950 hover:bg-purple-900 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            {saving ? 'Guardando...' : isEditMode ? 'Guardar Cambios' : 'Registrar Miembro'}
          </button>
        </div>
      </form>
    </>
  )
}