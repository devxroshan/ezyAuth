'use client'
import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { APIResponse } from "../config/api.config"


export const useDebounceAPI = (apiFunc:(...args:any)=>Promise<APIResponse>, delay:number) => {
    let timeOutRef = useRef<NodeJS.Timeout | null>(null)
    const [mutationError, setMutationError] = useState<string>("")

    const mutation = useMutation({
        mutationFn: apiFunc,
        onSuccess: (data) => {
            if(!data?.ok){
                setMutationError(data.msg)
            }
        },
        onError: (error: APIResponse) => {
            setMutationError(error.msg)
        }
    })

    const debounceMutate = ({...args}) => {
        if(timeOutRef.current){
            clearTimeout(timeOutRef.current)
        }

        timeOutRef.current = setTimeout(() => {
            mutation.mutate({...args})
        }, delay);             
    }

    return {
        ...mutation,
        debounceMutate,
        mutationError
    }
}