'use client';

import Logout from "@/components/logout";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';



export default function Dashboard() {
    const [user, setUser] = useState<User| null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const supabase = createClientComponentClient();
    


    useEffect(() => {
        async function getUser() {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setLoading(false);
            }
        }

        getUser();
    }, [])

    console.log('user: ', user)

    if (loading) {
        return (
           <div></div>
        )
    }
    
    if (!user) {
        router.push('/');
    }


    return (
        <Logout/>
    )
}