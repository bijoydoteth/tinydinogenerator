import { useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import traitList from '../public/traits/traitList.json';
import { selectedTraits, TraitSelectBoxProps } from './dinoInterface';
import { buttonStyle, getTraitImageLocation, getTraitsAndPathFromDinoId, noneImgPath } from './helpers';


const TraitSelectBox:React.FunctionComponent<TraitSelectBoxProps> = ({selectedTraits,setSelectedTraits})=>{

    const emptyTraits:selectedTraits= traitList.map((e)=>{
        return {
            traitName:e.name,
            traitValue:'none',
            layer:e.layer,
            userLocked:false
        }
    })

    const setRandomTraits = (selectedTraits:selectedTraits,mode='all') => {
        // select random traits from traitList
        // Must have traitName: background, body, chest, eyes
        // Optional traitName: face, feet, hands, spikes

        let randomTrait:{name:string,value:string}[] = []
        // get a list of traits that is not userLocked
        const userUnlockedTraitsName = selectedTraits.filter(e=>e.userLocked===false).map(e=>e.traitName)
        const userLockedTraits = selectedTraits.filter(e=>e.userLocked===true)


        // filter traitList with traits that is not userLocked
        const userUnlockedTraitList = traitList.filter(e=>userUnlockedTraitsName.includes(e.name))

        if(mode==='all'){
            for(const trait of userUnlockedTraitList){
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
            
            for (const trait of userUnlockedTraitList){
                if(activeTraitsList.includes(trait.name)){
                    const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)]; 
                    randomTrait.push({name:trait.name,value:randomProp})
                }
            }
            
        }else{
            return
        }

        // Push back the locked traits to random trait
        for (const trait of userLockedTraits){
            randomTrait.push({name:trait.traitName,value:trait.traitValue})
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

    const setRandomTraitSingle = (traitName:string) => {
        if(traitName==='none') return
        const trait = traitList.filter(e=>e.name===traitName)[0]
        const randomProp = trait.value[Math.floor(Math.random() * trait.value.length)]; 
        const newTraits = selectedTraits.map((e)=>{
            if(e.traitName===traitName){
                return {...e,traitValue:randomProp}
            }else{
                return e
            }
        })
        setSelectedTraits(newTraits)
    }

    const toggleUserLocked = (traitName:string) => {
        const newTraits = selectedTraits.map((e)=>{
            if(e.traitName===traitName){
                return {...e,userLocked:!e.userLocked}
            }else{
                return e
            }
        })
        setSelectedTraits(newTraits)
    }

    const resetTraits = () => {
        setSelectedTraits(emptyTraits)
    }

    const handleSelectChangeTraits = (selectedOption: any) => {
        
        setSelectedTraits((prevState:any) => {
            
            return prevState.map((e: { traitName: any; traitValue: any; })=>{
                if(e.traitName===selectedOption.name) {
                    return {...e,traitName:selectedOption.name,traitValue:selectedOption.value}
                }else{
                    return e
                }
            })
                   
        })
   
    };

    // select option is options from traitList with value and label
    const traitOptions = traitList.map(record=>{
        const name = record.name
        const value = [{value:'none',label:'None',name:record.name,image:noneImgPath},...record.value.map(e=>{
            const label = e.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            const image = getTraitImageLocation(record.name,e)
            return {value:e,label,name:record.name,image}
            })]

        return {name, value}
    })

    const handleDinoIdBox = (inputIdRef: any,setSelectedTraits: any) => {
        const inputValue = inputIdRef.current.value;
        
        const {traits,path} = getTraitsAndPathFromDinoId(inputValue)
        setSelectedTraits(traits)

    }
    
    const InputDinoIdBox = ({handleDinoIdBox}:any) => {
        const inputIdRef = useRef(null)
        

        return (
            <div className="flex flex-row items-center h-[40px]">
                <label> ID:</label>
                <input 
                type="text"
                className='w-24 px-2 h-full ml-2' 
                ref={inputIdRef} 
                placeholder={`Search ID`} />
                <button onClick={()=>handleDinoIdBox(inputIdRef,setSelectedTraits)} className={`h-full px-2 bg-gray-600 hover:bg-black text-white`}> → </button>
          </div>
        )
    }

    return (
        <div className='bg-gray-300 rounded-lg h-[600px]'>
            <div className='py-2 pl-10 pr-2 flex justify-between items-center font-bold text-left'>
                <InputDinoIdBox handleDinoIdBox={handleDinoIdBox} />
                <div>
                    <button onClick={resetTraits} className={`${buttonStyle} mx-1`}>Reset</button>
                    <button onClick={()=>setRandomTraits(selectedTraits,'all')} className={`${buttonStyle} mx-1`}> Random </button>
                    <button onClick={()=>setRandomTraits(selectedTraits,'only-active')} className={`${buttonStyle} mx-1`}> Random Active Traits </button>
                </div>
                
            </div>
            <div className='mt-3'>
                {traitList.map((record)=>{
                    const currentTraitLocked:boolean = selectedTraits.filter((e)=>e.traitName===record.name)[0].userLocked
                    const currentTraitValue = selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue
                    const currentTraitLabel = currentTraitValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    const currentTraitImage = getTraitImageLocation(record.name,currentTraitValue)
                    function formatOptionLabel({ label, image }:any) {
                        return (
                          <div className='flex'>
                            <img className='ml-1 mr-3' src={image} width={30} height={30} />
                            <span>{label}</span>
                          </div>
                        );
                      }
                    
                    return (
                        <div key={uuidv4()} 
                        className={`p-2 flex ${selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue!=='none'?'bg-gray-400':''}`}>
                            <div className='w-32 text-right px-2 flex items-center justify-end'>
                                <p>{`${(record.name).charAt(0).toUpperCase()+(record.name).slice(1)}`}: </p>
                            </div>
                            <div >
                                <Select 
                                instanceId='trait-select'
                                className='w-72' 
                                isDisabled={currentTraitLocked}
                                defaultValue={{value:currentTraitValue,label:currentTraitLabel,name:record.name,image:currentTraitImage}} 
                                onChange={handleSelectChangeTraits} 
                                options={traitOptions.filter(e=>e.name===record.name)[0].value}
                                formatOptionLabel={formatOptionLabel}
                                />
                                
                            </div>
                            <button className='mx-2' onClick={()=>setRandomTraitSingle(currentTraitLocked?'none':record.name)}>🎲</button>
                            <button className='mx-4 w-[50px] text-left' onClick={()=>toggleUserLocked(record.name)}>{currentTraitLocked?'Unlock':'Lock'}</button>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    )
    
}

export default TraitSelectBox