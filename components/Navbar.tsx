// create nav bar component with 3 options: home, existing pools, create pools
import Link from 'next/link';


export default function Navbar() {
    
    return (
        <div className='mx-auto flex justify-between h-12 bg-white text-gray-800 w-[650px] p-2'>
        <div className='flex items-center'>
            <Link href='/' className='font-bold text-xl mx-2'>Tiny Dino Generator</Link>
            {/* <Link href='/'>
            <div className='ml-4'>Home</div>
            </Link> */}
        </div>
        </div>
    )
}





