import { useUser } from '@/hooks/useUser'
import { MessageCircleMoreIcon, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { FaLocationPin } from 'react-icons/fa6'

const NavbarCom = () => {
    const {user, logout} = useUser();
    console.log(user);
    return (
        <div className="h-18 bg-white z-50 border-b-[1px] sticky top-0 w-full border-gray-300 flex items-center justify-between px-4">
            <div className='flex gap-4 items-center justify-center'>
                <Link href="/" >
                <Image src="/assets/images/logo.jpg" alt="Nanhi-Sanjivani" width={60} height={60} className="rounded-full shadow-md" />
                </Link>
                {user && <div className=' border-green-700 flex items-center justify-center p-2 rounded-md bg-white text-green-700'> <FaLocationPin /> <span className='text-sm font-semibold mx-1'> 263139 GEHU, Haldwani</span> <FaAngleDown color='green' /> </div>}
            </div>
            <div>
                <ul className='flex items-center justify-center gap-5 text-sm'>
                    <li><Link className='cursor-pointer hover:font-semibold hover:scale-[1.2]' href="/medcare">Medical services</Link></li>
                    <li><Link className='cursor-pointer hover:font-semibold hover:scale-[1.2]' href="/prep">E-Prescription</Link></li>
                    <li><Link className='cursor-pointer hover:font-semibold hover:scale-[1.2]' href="/medicines">Medicines</Link></li>
                    <li><Link className='cursor-pointer hover:font-semibold hover:scale-[1.2]' href="/doctor">Doctor Consult</Link></li>
                    <li><Link className='cursor-pointer hover:font-semibold hover:scale-[1.2]' href="/asha">ASHA Workers</Link></li>
                </ul>
            </div>
            <div>
                <div className=' border-black flex items-center justify-center p-2 rounded-md bg-white text-black'>{!user ? <Link href="/login" className=' font-semibold'>Login</Link> :<> <Link  href="/panic" className='border cursor-pointer mx-2 border-red text-red-700 flex items-center justify-center rounded-md p-2'> <span className='bg-red-700 w-2 h-2 rounded-full mx-2'></span> Panic!</Link> 
                <Link  href="/chat" className='cursor-pointer mx-2 border-red text-indigo-600 flex items-center justify-center rounded-md p-2'> <MessageCircleMoreIcon /> Chat with AI</Link>  <User /> <span className='text-sm font-semibold mr-2'>{user?.name},</span> <span className='font-semibold cursor-pointer ' onClick={logout}>Logout</span> </> }</div>
            </div>
        </div>
    )
}

export default NavbarCom