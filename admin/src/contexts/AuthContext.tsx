import { createContext } from 'react'
import { AuthContextType } from './AuthContextProvider'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
