import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import traitList from '../public/traits/traitList.json';
import { selectedTraits, TraitSelectBoxProps } from './dinoInterface';


const TraitSelectBox:React.FunctionComponent<TraitSelectBoxProps> = ({selectedTraits,setSelectedTraits})=>{

    const buttonStyle = 'bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'

    const emptyTraits:selectedTraits= traitList.map((e)=>{
        return {
            traitName:e.name,
            traitValue:'none',
            layer:e.layer,
            userLocked:false
        }
    })

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
        return {
            name:record.name,
            value: [{value:'none',label:'None',name:record.name},...record.value.map(e=>{
            return {value:e,label:e.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),name:record.name}
            })]
        }
    })
    // console.log(options);

    return (
        <div className='bg-gray-300 rounded-lg h-[500px]'>
            <div className='py-2 pl-10 pr-2 flex justify-between items-center font-bold text-left'>
                <h2>Select Dino Traits</h2>
                <div>
                    <button onClick={resetTraits} className={`${buttonStyle} mx-1`}>Reset</button>
                    <button onClick={()=>setRandomTraits('all')} className={`${buttonStyle} mx-1`}> Random </button>
                    <button onClick={()=>setRandomTraits('only-active')} className={`${buttonStyle} mx-1`}> Random Active Traits </button>
                </div>
                
            </div>
            <div className=''>
                {traitList.map((record)=>{
                    const currentTraitValue = selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue
                    const currentTraitLabel = currentTraitValue.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

                    return (
                        <div key={uuidv4()} 
                        className={`p-2 flex  ${selectedTraits.filter((e)=>e.traitName===record.name)[0].traitValue!=='none'?'bg-gray-400':''}`}>
                            <div className='w-32 text-right px-2'>{`${(record.name).charAt(0).toUpperCase()+(record.name).slice(1)}`}: </div>
                            <div >
                                <Select 
                                instanceId='trait-select'
                                className='w-64' 
                                defaultValue={{value:currentTraitValue,label:currentTraitLabel,name:record.name}} 
                                onChange={handleSelectChangeTraits} 
                                options={traitOptions.filter(e=>e.name===record.name)[0].value}/>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    )
    
}

export default TraitSelectBox