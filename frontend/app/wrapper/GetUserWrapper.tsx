'use client'
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { GetUserAPI } from "../api/user.api"
import { useUserStore } from "../stores/user.store"
import { useAppStore } from "../stores/app.store"


export const GetUserWrapper = ({children}:{children:React.ReactNode}) => {
    const setUser = useUserStore(state => state.setUser)
    const appStore = useAppStore()

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
        if(!appStore.isAuthenticated) return;
        
        getUserMutation.mutate()
    }, [appStore.isAuthenticated])

    return <>
    {children}
    </>
}