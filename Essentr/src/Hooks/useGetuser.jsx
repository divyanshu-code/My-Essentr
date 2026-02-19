'use client'
import { setUserData } from '@/Redux/userSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetuser = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        const getuser = async () => {

            try {
                const result = await fetch('/api/main', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await result.json()
                dispatch(setUserData(data))

            } catch (error) {

                console.log(error);

            }
        }

        getuser()

    }, [])
}

export default useGetuser