import loadingIcon from '@/assests/LoadingIcon.png';
import Image from 'next/image';

export default function LoadingScreen() {

    return (
        <div className='min-h-screen w-full flex flex-col justify-center items-center bg-gray-700'>
            <Image className="animate-spin" height={200} width={200} src={loadingIcon.src} alt="Loading"/>
            <p className=''>Loading...</p>
        </div>
    )
}