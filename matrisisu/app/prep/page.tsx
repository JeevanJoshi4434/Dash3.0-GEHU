"use client";
import FileUploadPage from '@/components/precrep';
import { UserProvider } from '@/context/userContext'
import React from 'react'

const page = () => {
  return (
    <UserProvider>
      <FileUploadPage />
    </UserProvider>
  )
}

export default page