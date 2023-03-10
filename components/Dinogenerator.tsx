import { useEffect, useState } from 'react';
import { emptyTraits, getImageFromSelectedTraits, getRandomTraits } from './helpers';
import TraitDisplayBox from './TraitDisplayBox';
import TraitSelectBox from './TraitSelectBox';


export default function Dinogenerator() {

    const [selectedTraits, setSelectedTraits] = useState(emptyTraits);
    const [combinedImageURL, setCombinedImageURL] = useState('');

    // get random traits when page load
    useEffect(() => {
        const randomTraits = getRandomTraits(emptyTraits,'all')
        setSelectedTraits(randomTraits)
    }, []);



    useEffect(() => {
        getImageFromSelectedTraits(selectedTraits).then((url)=>{
            setCombinedImageURL(url)
        })
      
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