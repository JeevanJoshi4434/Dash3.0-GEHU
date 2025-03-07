"use client";
import DoctorPage from '@/components/doctor';
import { UserProvider } from '@/context/userContext'
import React from 'react'

const page = () => {
  return (
    <UserProvider>
        <DoctorPage />
    </UserProvider>
  )
}

export default page