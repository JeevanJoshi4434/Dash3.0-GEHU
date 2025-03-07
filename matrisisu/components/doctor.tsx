import { useUser } from '@/hooks/useUser'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import MapBox, { Location } from './mapbox';
import { Phone, User } from 'lucide-react';

const DoctorPage = () => {
    const { user, token } = useUser();
    const [list, setList] = useState<Location[]>([]);
    const [lists, setLists] = useState([]);
    const [page, setPage] = useState(1);
    async function getNearDoctor() {
        try {
            if (!token) return;
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/doctor/near?latitude=${user?.location.coordinates[0]}&longitude=${user?.location.coordinates[1]}&page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = res.data;
            let final;

            if (data?.list) {
                setLists(data?.list);
                data?.list.forEach((obj: any) => {
                    const final = {
                        longitude: obj.location.coordinates[0],
                        latitude: obj.location.coordinates[1],
                        name: obj.name
                    };
                    console.log(final, obj.location.coordinates[0], obj.location.coordinates[1]);
                    setList((prev) => [...prev, final]);
                });
            }
            console.log(list);
        } catch (error) {
            console.log(error);
        }
    }

    function fetchMore() {
        setPage(page + 1);
    }
    useEffect(() => {
        if (!user || !token) return;
        getNearDoctor();
    }, [page, token])
    return (
        <div className='w-full min-h-screen'>
            <div className='lg:p-14'>
                {
                    user &&
                    list.length > 0 &&
                    <MapBox locations={list} user={{
                        location: {
                            latitude: user?.location.coordinates[1],
                            longitude: user?.location.coordinates[0],
                        },
                        name: user?.name
                    }} zoom={10} />
                }
                <div className='grid mt-10 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
                    {
                        user && list.length > 0 &&
                        lists.map((item: any, index: number) => {
                            const dist = haversine(user?.location.coordinates[1], user?.location.coordinates[0], item.location.coordinates[1], item.location.coordinates[0]);
                            return (
                                <div key={index} className='flex items-center justify-between max-w-[300px] border rounded-lg p-4 border-gray-300 '>
                                    <div className='flex gap-2 items-center justify-center'>
                                        <User className='h-14 w-14 rounded-full' />
                                        <div>
                                            <p>{item?.name}</p>
                                            <p>+91 {item?.phone}</p>
                                            <p>{dist < 1 ? dist.toFixed(0) + "meter away" : dist.toFixed(2) + " kms"}</p>
                                        </div>
                                    </div>
                                    <div onClick={() => window.open(`tel:${item?.phone}`)} className='w-9 h-9 bg-green-700 p-2 rounded-full flex items-center justify-center cursor-pointer'>
                                        <Phone className='rounded-full text-white ' />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DoctorPage



export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
