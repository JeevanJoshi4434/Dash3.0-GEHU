"use client";
import Panic from '@/components/panic'
import { UserProvider } from '@/context/userContext'
import React from 'react'

const page = () => {
    return (
        <UserProvider>
            <Panic />
        </UserProvider>
    )
}

export default page