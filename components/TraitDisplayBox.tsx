import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { TraitDisplayBoxProps } from './dinoInterface';



const TraitDisplayBox:React.FunctionComponent<TraitDisplayBoxProps> = ({selectedTraits,imageURL}) => {
    const buttonStyle = 'bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'
    
    return (
        <div className='flex justify-between mt-10 h-[350px]'>
            <div className='ml-10 h-[300px] w-[320px]'>
                <Image
                className='mx-auto border border-gray-500 rounded-lg shadow-lg'
                priority={true}
                src={imageURL!==''?imageURL:'/traits/1600x1600/logo.png'} 
                alt="tinydino"
                width={300}
                height={300} />
                
            </div>
            <div className='pr-5 h-[300px] w-[300px] flex flex-col justify-between'>
                <div className='my-auto'>
                    
                    {selectedTraits.map((trait)=>{
                        if(trait.traitValue==='none') return
                        return (
                            <div key={uuidv4()} className='flex'>
                                <div className='w-[100px] text-right pr-2'>
                                    {trait.traitName.charAt(0).toUpperCase() + trait.traitName.slice(1)}:
                                </div>
                                <div>
                                    {trait.traitValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='flex justify-start'>
                    <a href={imageURL} download="tiny_dino.jpg"><button className={`${buttonStyle} ml-10`}>Download</button></a>    
                </div>
                
            </div>
        </div>
    )
}

export default TraitDisplayBox