import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { selectedTraits, TraitDisplayBoxProps } from './dinoInterface';



const TraitDisplayBox:React.FunctionComponent<TraitDisplayBoxProps> = ({selectedTraits,imageURL}) => {
    const buttonStyle = 'bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'
    const initialDescription = 'Get descriptions for your dino'
    const [dinoDescription,setDinoDescription] = useState(initialDescription)
    const [loading,setLoading] = useState(false)


    // use useEffect to reset dinoDescription when selectedTraits changes
    useEffect(()=>{
        setDinoDescription(initialDescription)
    },[selectedTraits])

    const handleGetDescription = () => {
        // use getDinoNames api to get the description
        // api example: /api/getDinoName?body=blue&background=pink&chest=blue&eyes=dark-red&feet=hoverboard&hands=kite&spikes=blue
        setLoading(true)
        const queryParam = selectedTraits.map((trait)=>{
            if(trait.traitValue==='none') return ''
            return `${trait.traitName}=${trait.traitValue}`
        }).filter(e=>e!=='')
        if(queryParam.length===0) {
            setLoading(false)
            setDinoDescription('Select at least one trait to get description.')
            return
        }

        const queryUrl = `/api/getDinoName?${queryParam.join('&')}`

        axios.get(queryUrl).then((res)=>{
            const response = res.data.description
            setDinoDescription(response)         
            setLoading(false)
        }).catch((err)=>{
            setDinoDescription('Something went wrong, try again later.')     
            setLoading(false)
        })
    }

    const DinoDescriptionBox = ()=>{
        // render a box with dino description with border  
        return (
            <div className='mr-10'>
                <div className='border border-gray-500 rounded-lg shadow-lg p-2'>
                    <p className='h-[80px] overflow-y-auto'>{loading?'Loading description...':dinoDescription}</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className='ml-10 mt-10'>
            <div className='flex justify-between h-[320px]'>
                <div className='h-[300px] w-[320px]'>
                    <Image
                    className='mx-auto border border-gray-500 rounded-lg shadow-lg'
                    priority={true}
                    src={imageURL!==''?imageURL:'/traits/1600x1600/logo.png'} 
                    alt="tinydino"
                    width={300}
                    height={300} />
                    
                </div>
                <div className=' h-[300px] w-[300px] flex flex-col justify-between'>
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
                        {loading?
                        <button className={`${buttonStyle}  ml-10 text-sm w-[113px]`}> Loading</button>
                        :
                        <button className={`${buttonStyle}  ml-10 text-sm w-[113px]`} onClick={handleGetDescription}>Descriptions</button>}
                        
                        <a href={imageURL} download="tiny_dino.jpg"><button className={`${buttonStyle} ml-2 text-sm`}>Download</button></a>
                    </div>
                    
                </div>
            </div>
            <div className='w-full mb-5'>
                <DinoDescriptionBox />
            </div>
        </div>
    )
}

export default TraitDisplayBox