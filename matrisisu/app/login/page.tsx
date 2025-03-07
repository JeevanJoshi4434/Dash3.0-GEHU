"use client";
import LoginForm from '@/components/login-form';
import { UserProvider } from '@/context/userContext';
import Image from 'next/image';
import React from 'react'

const Login = () => {

    return (
        <UserProvider>

            <main className="lg:grid grid-cols-2 m-0  max-lg:mt-15 w-full min-h-screen items-center justify-center">
                <div className="w-[screen/2] flex flex-col items-center justify-center">
                    <div className="mb-8 w-full lg:px-28 text-start">
                        <h1 className="text-3xl  max-md:mx-4 font-semibold">Welcome back</h1>
                        <p className=" max-md:mx-4 text-muted-foreground mt-2">Sign in to your account</p>
                    </div>
                    <div className='w-full lg:px-28'>
                        <LoginForm />
                    </div>
                </div>
                <div className='flex items-center justify-center text-white w-full bg-blue-500 rounded-xl h-screen max-md:hidden '>
                    <div className='flex items-center gap-2 justify-center flex-col'>
                        <Image src="/assets/images/logo.jpg" alt="Nanhi-Sanjivani" width={200} height={200} className="rounded-full shadow-md w-60 h-60" />
                        <p className='text-2xl font-semibold'>नन्ही संजीवनी</p>
                        <p className='text-lg'>Dedicated Care for Mothers and Babies, Anytime, Anywhere.</p>
                    </div>
                </div>

            </main>
        </UserProvider>
    )
}

export default Login