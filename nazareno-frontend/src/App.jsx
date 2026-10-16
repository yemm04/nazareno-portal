import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { MembersProvider } from './context/MembersContext'
import { AttendanceProvider } from './context/AttendanceContext'
import { TasksProvider } from './context/TasksContext'
import AppLayout from './layouts/AppLayout'
import AdminRoute from './layouts/AdminRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Miembros from './pages/Miembros'
import NuevoMiembro from './pages/NuevoMiembro'
import MarcarEntrada from './pages/MarcarEntrada'
import RegistroAsistencias from './pages/RegistroAsistencias'
import Tareas from './pages/Tareas'
import Calendario from './pages/Calendario'
import Reportes from './pages/Reportes'
import MiPerfil from './pages/MiPerfil'
import ComingSoon from './pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      <MembersProvider>
        <AttendanceProvider>
          <TasksProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<AppLayout />}>
                  <Route path="/marcar-entrada" element={<MarcarEntrada />} />
                  <Route path="/tareas" element={<Tareas />} />
                  <Route path="/calendario" element={<Calendario />} />
                  <Route path="/comunicaciones" element={<ComingSoon title="Comunicaciones" />} />
                  <Route path="/perfil" element={<MiPerfil />} />

                  <Route element={<AdminRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/miembros" element={<Miembros />} />
                    <Route path="/miembros/nuevo" element={<NuevoMiembro />} />
                    <Route path="/miembros/:id/editar" element={<NuevoMiembro />} />
                    <Route path="/control-ingreso" element={<ComingSoon title="Control de Ingreso" />} />
                    <Route path="/asistencias" element={<RegistroAsistencias />} />
                    <Route path="/reportes" element={<Reportes />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
          </TasksProvider>
        </AttendanceProvider>
      </MembersProvider>
    </AuthProvider>
  )
}