'use client'
import React, { useEffect } from 'react'
import { getSocket } from './Config/socket'

const GeoUpdater = ({ userId }) => {

    useEffect(() => {

        if (!userId) return
        if (!navigator.geolocation) return

        const socket = getSocket();
        socket.emit("userId", userId);

        const location = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;

            socket.emit("updateLocation", { userId, latitude, longitude })

        }, (error) => {
            console.log(error)
        }, { enableHighAccuracy: true })

        return () => {
            navigator.geolocation.clearWatch(location)
        }

    }, [userId])

    return null
}

export default GeoUpdater