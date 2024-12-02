import loadingIcon from '@/assests/LoadingIcon.png';
import Image from 'next/image';

export default function LoadingScreen() {

    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
            <Image className="animate-spin" height={64} src={loadingIcon.src} alt="Loading"/>
            <p>Loading...</p>
        </div>
    )
}