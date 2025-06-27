import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from 'react';

// export default function Login() {
//   const { login } = useAuth();
//   const [form, setForm] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login(form);
//     navigate('/tasks');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Iniciar sesión</h2>
//       <input placeholder="Usuario" onChange={(e) => setForm({ ...form, username: e.target.value })} />
//       <input placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
//       <button type="submit">Entrar</button>
//     </form>
//   );
// }



export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await login(form);

    setTimeout(() => {
      setIsLoading(false)
      navigate("/tasks");
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TaskManager</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <Input
                  type="text"
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Tu usuario"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Tu contraseña"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <br />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Regístrate aquí
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}