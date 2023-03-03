import { createCanvas, loadImage } from 'canvas';
import Image from 'next/image';
import { type } from 'os';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import traitList from '../public/traits/traitList.json';


export default function Dinogenerator() {
    const [selectedTraits, setSelectedTraits] = useState<any>([]);
    const [combinedImageURL, setCombinedImageURL] = useState('');

    const buttonStyle = 'my-2 bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'

    useEffect(() => {
        getImageFromSelectedTraits(selectedTraits)
    }, [selectedTraits]);

    const handleSelectChangeTraits = (event: { target: any; }) => {
        setSelectedTraits((prevState: any) => {
            return {
                ...prevState,
                [event.target.id]: event.target.value
            }
        })
        
    }

    const setRandomTraits = (mode='all') => {
        // select random traits from traitList
        // Must have traitName: background, body, chest, eyes
        // Optional traitName: face, feet, hands, spikes

        let randomTrait:{name:string,value:string}[] = []
        if(mode==='all'){
            for(const trait of traitList){
                if(trait.name==='background'||trait.name==='body'||trait.name==='chest'||trait.name==='eyes'){
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
            const activeTraitsList = Object.keys(selectedTraits)
            for (const trait of traitList){
                if(activeTraitsList.includes(trait.name)){
                    const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)]; 
                    randomTrait.push({name:trait.name,value:randomProp})
                }
            }
            
        }else{
            return
        }
        
        const randomTraitObject = randomTrait.reduce((acc, curr) => {
            return {...acc,[curr.name]:curr.value};
          }, {});
        
        setSelectedTraits(randomTraitObject)
    
    }

    const resetTraits = () => {
        setSelectedTraits([])
    }

    const traitSelectBox = ()=>{
        
        return (
            <div className='bg-gray-300 rounded-lg shadow-md '>
                <div className='py-2 px-10 font-bold text-left'>Select dino traits</div>
                {traitList.map((record)=>{
                    return (
                        <div key={uuidv4()} className={`p-2 flex  ${selectedTraits[record.name]&&selectedTraits[record.name]!=='none'?'bg-gray-400':''}`}>
                            <div className='w-32 text-right px-2'>{record.name}: </div>
                            <select name={record.name} id={record.name} value={selectedTraits[record.name]} onChange={handleSelectChangeTraits} className='w-64'>
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

    const getImageFromSelectedTraits = async(selectedTraits:any) => {
        const width = 1600;
        const height = width;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        const traitNameList = Object.keys(selectedTraits)
        if(traitNameList.length===0){
            const image = await loadImage(`/traits/1600x1600/logo.png`);
            ctx.drawImage(image, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCombinedImageURL(dataUrl)
            return
        }

        const traits = traitNameList.map((traitName)=>{
            let layer
            switch(traitName){
                case 'background':
                    layer=1
                    break;
                case 'body':
                    layer=2
                    break
                case 'chest':
                    layer=3
                    break
                case 'eyes':
                    layer=4
                    break
                case 'face':
                    layer=5
                    break
                case 'feet':
                    layer=6
                    break
                case 'hands':
                    layer=7
                    break
                case 'spikes':
                    layer=8
                    break
                default:
                    layer=100
                    break
            }
            return {name:traitName,value:selectedTraits[traitName],layer}
        }).sort((a, b) => a.layer - b.layer);

        for(const trait of traits){
            if(trait.value!=='none'){
                const image = await loadImage(getTraitImageLocation(trait.name,trait.value,1600));
                ctx.drawImage(image, 0, 0, width, height);
            }
        }

        const dataUrl = canvas.toDataURL('image/jpeg');
        // console.log(dataUrl);
        setCombinedImageURL(dataUrl)
        return

    }
    
    return (
        <div>
            <div className="">
                <button onClick={resetTraits} className={buttonStyle}>Reset</button>
                <button onClick={()=>setRandomTraits('all')} className={`${buttonStyle} mx-2`}> Random </button>
                <button onClick={()=>setRandomTraits('only-active')} className={`${buttonStyle} mx-2`}> Random Active Traits </button>
                <div>{traitSelectBox()}</div>
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
                            {Object.keys(selectedTraits).map((trait: any)=>{
                                if(selectedTraits[trait]==='none') return
                                return (
                                    <div key={uuidv4()}>{trait}: {selectedTraits[trait]}</div>
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