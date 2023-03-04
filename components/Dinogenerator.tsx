import mergeImages from 'merge-images';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import traitList from '../public/traits/traitList.json';
import { selectedTraits } from './dinoInterface';
import { emptyImgPath, emptyTraits, getImageFromSelectedTraits } from './helpers';
import TraitDisplayBox from './TraitDisplayBox';
import TraitSelectBox from './TraitSelectBox';


export default function Dinogenerator() {

    const [selectedTraits, setSelectedTraits] = useState(emptyTraits);
    const [combinedImageURL, setCombinedImageURL] = useState('');

    useEffect(() => {
        getImageFromSelectedTraits(selectedTraits).then((url)=>{
            setCombinedImageURL(url)
        })
        // console.log(selectedTraits);   
    }, [selectedTraits]);
    
    return (
        <div>
            <div className="mx-auto w-[650px] mb-5 pt-1 rounded-lg bg-gray-300">
                <TraitDisplayBox selectedTraits={selectedTraits} imageURL={combinedImageURL}  />     
                <TraitSelectBox selectedTraits={selectedTraits} setSelectedTraits={setSelectedTraits} />
            </div>
        </div>
        
    )
}