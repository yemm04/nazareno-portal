import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!codigo || !password) {
      setError('Completa tu código de usuario y contraseña.')
      return
    }

    setLoading(true)
    try {
      const data = await login(codigo, password)
      navigate(data.rol === 'ADMIN' ? '/dashboard' : '/marcar-entrada')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

return (

<div className="min-h-screen flex">


    {/* PANEL IZQUIERDO */}

    <div className="hidden lg:block lg:w-1/2 min-h-[calc(100vh-48px)] bg-purple-950 relative overflow-hidden"> 
      <img src="/IMAGEN.png" alt="Colegio El Nazareno" className="absolute inset-0 w-full h-full object-cover" /> 
    </div>



{/* PANEL DERECHO */}

<div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-white px-5 py-8 sm:px-8">

  <div className="w-full max-w-md">

    {/* ENCABEZADO */}
    <div className="mb-10">

      <div className="flex items-center justify-between gap-3 sm:gap-6">

        {/* TÍTULO */}
        <div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 leading-tight">
            PORTAL DE
            <br />
            <span className="text-amber-500">
              ASISTENCIAS
            </span>
          </h2>

        </div>

        {/* LOGO */}
        <img
          src="/logo-nazareno.png"
          alt="Logo Colegio El Nazareno"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
        />

      </div>


      {/* TEXTO */}
      <p className="text-gray-500 mt-6">
        Ingresa tus datos para{' '}
        <span className="font-semibold text-purple-900">
          iniciar sesión
        </span>.
      </p>

    </div>


    {/* FORMULARIO */}
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* CÓDIGO */}
      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Código de Usuario
        </label>

        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="w-full border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-amber-50 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all"
        />

        <p className="text-xs text-gray-400 mt-2">
          Ejemplo: P12345 o C12345
        </p>

      </div>


      {/* CONTRASEÑA */}
      <div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Contraseña
        </label>

        <div className="relative">

          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            className="w-full border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 pr-12 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-amber-50 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-800 hover:text-amber-500"
          >

            {showPassword ? (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-6 9.75-6 9.75 6 9.75 6-3.75 6-9.75 6-9.75-6-9.75-6Z"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="2.5"
                />
              </svg>

            ) : (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.58 10.59a2 2 0 0 0 2.83 2.83M9.88 5.08A10.84 10.84 0 0 1 12 4.88c6 0 9.75 6 9.75 6a17.42 17.42 0 0 1-3.26 3.78M6.23 6.23C3.62 7.84 2.25 10.88 2.25 10.88s3.75 6 9.75 6c1.1 0 2.11-.2 3.02-.52"
                />
              </svg>

            )}

          </button>

        </div>

      </div>


      {/* ERROR */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}


      {/* BOTÓN */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-purple-950 font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>

    </form>


    {/* PIE */}
    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
    </div>

  </div>

</div>


  </div>
)

}