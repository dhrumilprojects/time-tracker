import React, { Children, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Loading from './Loading'

function PrivateRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])
    if (loading) {
        return <Loading />
    }
    return isAuthenticated ? (children) : <Navigate to='/login' state={{ from: location }} />
}

export default PrivateRoute