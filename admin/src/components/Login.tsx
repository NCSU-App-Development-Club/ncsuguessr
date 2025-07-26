import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [tokenInput, setTokenInput] = useState<string>('')

  const { auth, authLoaded, setAuth } = useAuthContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (authLoaded && auth !== null) {
      navigate('/home')
    }
  }, [auth, navigate, authLoaded])

  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    try {
      // TODO: perform auth request (no backend route for token verification)
      setAuth(tokenInput)
    } catch (e) {
      console.error(e)
      setLoginError(`${e}`)
    }
  }

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-2 md:p-4 lg:p-5">
      <div className="text-center flex flex-col gap-5 w-[100%]">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="flex justify-center gap-2">
            <input
              type="text"
              placeholder="Token"
              className="border-2 border-black rounded-md p-1"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button
              disabled={tokenInput.length === 0}
              type="submit"
              className="bg-gray-200 rounded-md p-1 border-black border-2 active:bg-white active:border-gray-200 active:scale-90 transition duration-[30ms] hover:cursor-pointer"
            >
              Log in
            </button>
            <div className="text-red">{loginError}</div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
