import { useNavigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect } from 'react'

const ProtectedPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { auth, authLoaded } = useAuthContext()

  const navigate = useNavigate()

  useEffect(() => {
    if (authLoaded && auth === null) {
      navigate('/', { replace: true })
    }
  }, [navigate, auth, authLoaded])

  return !authLoaded || !auth ? null : <div>{children}</div>
}

export default ProtectedPageWrapper
