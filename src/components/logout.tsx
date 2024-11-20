import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';


export default function Logout() {
    const supabase = createClientComponentClient();

    const router = useRouter();

    const handleLogOut = async () => {
        await supabase.auth.signOut();  
        router.push('/')
    }

    return (
        <div>
            <button
            className="w-full mb-2 p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
            onClick={handleLogOut}
            >
                Logout
            </button>
        </div>
    )
}