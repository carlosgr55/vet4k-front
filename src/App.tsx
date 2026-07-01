import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/AppLayout'
import { LoginPage } from '@/pages/Login'
import { RegistroPage } from '@/pages/Registro'
import { ClienteInicio } from '@/pages/cliente/ClienteInicio'
import { ClienteMascotas } from '@/pages/cliente/ClienteMascotas'
import { ClienteAgendar } from '@/pages/cliente/ClienteAgendar'
import { ClienteCitas } from '@/pages/cliente/ClienteCitas'
import { ClienteHistorial } from '@/pages/cliente/ClienteHistorial'
import { VetInicio } from '@/pages/veterinario/VetInicio'
import { VetCitas } from '@/pages/veterinario/VetCitas'
import { VetHistorial } from '@/pages/veterinario/VetHistorial'
import { RecepInicio } from '@/pages/recepcion/RecepInicio'
import { RecepClientes } from '@/pages/recepcion/RecepClientes'
import { RecepAgendar } from '@/pages/recepcion/RecepAgendar'
import { RecepCitas } from '@/pages/recepcion/RecepCitas'
import { AdminInicio } from '@/pages/admin/AdminInicio'
import { AdminVeterinarios } from '@/pages/admin/AdminVeterinarios'
import { AdminRecepcionistas } from '@/pages/admin/AdminRecepcionistas'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          <Route element={<ProtectedRoute allow={['CLIENTE']} />}>
            <Route element={<AppLayout />}>
              <Route path="/cliente" element={<ClienteInicio />} />
              <Route path="/cliente/mascotas" element={<ClienteMascotas />} />
              <Route path="/cliente/agendar" element={<ClienteAgendar />} />
              <Route path="/cliente/citas" element={<ClienteCitas />} />
              <Route path="/cliente/historial" element={<ClienteHistorial />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allow={['VETERINARIO']} />}>
            <Route element={<AppLayout />}>
              <Route path="/veterinario" element={<VetInicio />} />
              <Route path="/veterinario/citas" element={<VetCitas />} />
              <Route path="/veterinario/historial" element={<VetHistorial />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allow={['RECEPCION']} />}>
            <Route element={<AppLayout />}>
              <Route path="/recepcion" element={<RecepInicio />} />
              <Route path="/recepcion/clientes" element={<RecepClientes />} />
              <Route path="/recepcion/agendar" element={<RecepAgendar />} />
              <Route path="/recepcion/citas" element={<RecepCitas />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allow={['ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminInicio />} />
              <Route path="/admin/veterinarios" element={<AdminVeterinarios />} />
              <Route path="/admin/recepcionistas" element={<AdminRecepcionistas />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
