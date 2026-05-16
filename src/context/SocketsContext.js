import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if (!user) return // chưa login thì không connect

        const newSocket = io(process.env.REACT_APP_WS_URL, {
            auth: { userId: user._id },
            transports: ['websocket'],
        })

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id)
        })

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket connect error:', err.message)
        })

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason)
        })

        setSocket(newSocket)

        return () => newSocket.disconnect()
    }, [user]) // reconnect nếu user thay đổi

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)