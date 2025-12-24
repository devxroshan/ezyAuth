'use client'
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { GetUserAPI } from "../api/user.api"
import { useUserStore } from "../stores/user.store"


export const GetUserWrapper = ({children}:{children:React.ReactNode}) => {
    const setUser = useUserStore(state => state.setUser)

    const getUserMutation = useMutation({
        mutationFn: GetUserAPI,
        onSuccess: (data) => {
            if(data.ok){
                setUser({...data.data})
            }
        },
        onError: (err) => {

        }
    })

    useEffect(() => {
        getUserMutation.mutate()
    })

    return <>
    {children}
    </>
}