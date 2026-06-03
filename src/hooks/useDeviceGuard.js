/* eslint-disable react-hooks/exhaustive-deps */
// hook/useDeviceGuard.ts
import { useEffect } from 'react'
import { useSocket } from '../context/SocketsContext'
import { useAuth } from '../context/AuthContext'
import { useAlert } from './useAlert'

export function useDeviceGuard() {
    const socket = useSocket()
    const { logout } = useAuth()
    const { showAlert } = useAlert();
    useEffect(() => {
        if (!socket) return
        socket.on('DEVICE_LOGIN_DETECTED', ({ message }) => {            
            showAlert(message, "error")
            socket.disconnect()
            setTimeout(() => logout(), 4000) // logout sau 2s để user đọc toast
        })

        return () => { socket.off('DEVICE_LOGIN_DETECTED') }
    }, [socket, logout])
}