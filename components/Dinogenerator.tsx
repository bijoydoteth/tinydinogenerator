import mergeImages from 'merge-images';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import traitList from '../public/traits/traitList.json';


export default function Dinogenerator() {
    interface selectedTraits {
        traitName: string;
        traitValue: string;
        layer: number;
        userLocked: boolean;
    } 
    
    const emptyTraits= traitList.map((e: { name: any;layer:any })=>{
        return {
            traitName:e.name,
            traitValue:'none',
            layer:e.layer,
            userLocked:false
        }
    })
    const [selectedTraits, setSelectedTraits] = useState(emptyTraits);
    const [combinedImageURL, setCombinedImageURL] = useState('');

    const buttonStyle = 'my-2 bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'

    useEffect(() => {
        getImageFromSelectedTraits()
        // console.log(selectedTraits);
        
    }, [selectedTraits]);

    const handleSelectChangeTraits = (event: { target: any; }) => {
        
        setSelectedTraits((prevState: any) => {
            
            return prevState.map((e: { traitName: any; traitValue: any; })=>{
                if(e.traitName===event.target.id) {
                    return {...e,traitName:event.target.id,traitValue:event.target.value}
                }else{
                    return e
                }
            })
                   
        })
        
    }

    const setRandomTraits = (mode='all') => {
        // select random traits from traitList
        // Must have traitName: background, body, chest, eyes
        // Optional traitName: face, feet, hands, spikes

        let randomTrait:{name:string,value:string}[] = []
        if(mode==='all'){
            for(const trait of traitList){
                if(trait.basic===true){
                    const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)];                  
                    randomTrait.push({name:trait.name,value:randomProp})
                }else{
                    const includeTrait = Math.round(Math.random())
                    if(includeTrait===1){
                        const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)]; 
                        randomTrait.push({name:trait.name,value:randomProp})
                    }
                }
            }
        }else if(mode==='only-active'){
            const activeTraitsList = selectedTraits.filter(e=>e.traitValue!=='none').map((e)=>e.traitName)
            
            for (const trait of traitList){
                if(activeTraitsList.includes(trait.name)){
                    const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)]; 
                    randomTrait.push({name:trait.name,value:randomProp})
                }
            }
            
        }else{
            return
        }

        const newTraits = selectedTraits.map((e)=>{
            if(randomTrait.map((e)=>e.name).includes(e.traitName)){
                return {...e,traitValue:randomTrait.filter((elm)=>elm.name===e.traitName)[0].value}
            }else{
                return {...e,traitValue:'none'}
            }
        })
  
        setSelectedTraits(newTraits)
    
    }

    const resetTraits = () => {
        setSelectedTraits(emptyTraits)
    }

    const TraitSelectBox = ()=>{

        return (
            <div className='bg-gray-300 rounded-lg shadow-md '>

                
                <div className='py-2 pl-10 pr-2 flex justify-between items-center font-bold text-left'>
                    <h2>Select dino traits</h2>
                    <div>
                        <button onClick={resetTraits} className={`${buttonStyle} mx-1`}>Reset</button>
                        <button onClick={()=>setRandomTraits('all')} className={`${buttonStyle} mx-1`}> Random </button>
                        <button onClick={()=>setRandomTraits('only-active')} className={`${buttonStyle} mx-1`}> Random Active Traits </button>
                    </div>
                    
                </div>
                {traitList.map((record)=>{
                    return (
                        <div key={uuidv4()} 
                        className={`p-2 flex  ${selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue!=='none'?'bg-gray-400':''}`}>
                            <div 
                            className='w-32 text-right px-2'>{record.name}: </div>
                            <select name={record.name} id={record.name} value={selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue} onChange={handleSelectChangeTraits} className='w-64'>
                                <option value="none">none</option>
                                {record.value.map((traitValue: string)=>{
                                    return (
                                        <option key={uuidv4()} value={traitValue}>{traitValue}</option>
                                    )
                                })}
                            </select>
                        </div>
                    )
                })}
            </div>
        )
        
    }

    const getTraitImageLocation = (traitName:string,traitValue:string,resolution:number=1600) => {
        return `/traits/${resolution}x${resolution}/${traitName}/${traitValue}.png`
    }

    const getImageFromSelectedTraits = async() => {
        const width = 1600;
        const height = width;

        const activeTraitsList = selectedTraits.filter(e=>e.traitValue!=='none').sort((a, b) => a.layer - b.layer).map(e=>getTraitImageLocation(e.traitName,e.traitValue,1600));
        
        if(activeTraitsList.length===0){
            const dataUrl = await mergeImages(['/traits/1600x1600/logo.png'])
            setCombinedImageURL(dataUrl)
            return
        }

        const combineImages = activeTraitsList
        const dataUrl = await mergeImages(combineImages)

        // console.log(dataUrl);
        setCombinedImageURL(dataUrl)
        return

    }
    
    return (
        <div>
            <div className="">
                <TraitSelectBox />
                <div className='flex justify-left my-10'>
                    <div className=''>
                        {combinedImageURL!==''?
                        <Image
                        className='mx-auto my-2 border border-gray-500 rounded-lg shadow-md'
                        src={combinedImageURL} 
                        alt="Combined Image"
                        width={300}
                        height={300} />
                        :
                        null
                        }
                    </div>
                    <div className='mx-10 flex flex-col justify-between'>
                        <div className=''>
                            <p className='font-bold my-2'>Selected traits</p>
                            {selectedTraits.map((trait)=>{
                                if(trait.traitValue==='none') return
                                return (
                                    <div key={uuidv4()}>{trait.traitName}: {trait.traitValue}</div>
                                )
                            })}
                        </div>
                        <div>
                            <a href={combinedImageURL} download="tiny_dino.jpg"><button className={buttonStyle}>Download JPG</button></a>
                            
                        </div>
                        
                    </div>
                </div>
                
               
            </div>
        </div>
        
    )
}