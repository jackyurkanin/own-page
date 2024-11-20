import loadingIcon from '@/assests/LoadingIcon.png';

export default function LoadingScreen() {

    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
            <img className='h-16 w-auto spin' src={loadingIcon.src} alt="Loading"></img>
            <p>Loading...</p>
        </div>
    )
}