import { useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const { auth, setAuth } = useAuthContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
      setAuth(null)
    }
    navigate('/')
  }, [setAuth, navigate, auth])

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex justify-center p-2 md:p-4 lg:p-5">
      <div className="text-center flex flex-col gap-5 w-[100%]">
        <h1 className="text-4xl font-bold">Logging out...</h1>
      </div>
    </div>
  )
}

export default Logout
