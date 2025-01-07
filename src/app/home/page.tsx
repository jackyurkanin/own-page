'use client';

import Logout from "@/components/logout";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import LoadingScreen from "@/components/Loading";



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
    }, [supabase.auth])

    console.log('user: ', user)

    if (loading) {
        return (
           <LoadingScreen/>
        )
    }
    
    if (!user) {
        router.push('/');
    }


    return (
        <main>
            <section>

            </section>
            <section>

            </section>
        </main>
    )
}