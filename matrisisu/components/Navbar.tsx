"use client";
import { UserProvider } from '@/context/userContext'
import React, { useEffect, useState } from 'react'
import NavbarCom from './navbar-component';

const Navbar = () => {
    const [loader, setLoader] = useState(true);
    const [Show, setShow] = useState(true);
    useEffect(() => {
        if(window.location.pathname === '/login' || window.location.pathname === '/signup'){
            setShow(false);
            setLoader(false);
        }else{
            setLoader(false);
        }
    })
    if(!loader && Show){       
        return (
            <UserProvider>
            <NavbarCom></NavbarCom>
        </UserProvider>
    )
    }else{
        return null;
    }
}

export default Navbar