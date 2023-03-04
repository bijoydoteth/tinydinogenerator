import mergeImages from 'merge-images';
import traitList from '../public/traits/traitList.json';
import { selectedTraits } from './dinoInterface';

export const buttonStyle = 'bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'
export const emptyImgPath = '/traits/1600x1600/logo.png'
export const emptyTraits:selectedTraits= traitList.map((e)=>{
    return {
        traitName:e.name,
        traitValue:'none',
        layer:e.layer,
        userLocked:false
    }
})

export const getTraitImageLocation = (traitName:string,traitValue:string,resolution:number=1600) => {
    return `/traits/${resolution}x${resolution}/${traitName}/${traitValue}.png`
}

export const getImagePathsFromSelectedTraits = (selectedTraits:selectedTraits) => {
    return selectedTraits.filter(e=>e.traitValue!=='none').sort((a, b) => a.layer - b.layer).map(e=>getTraitImageLocation(e.traitName,e.traitValue,1600));
}

export const getImageFromSelectedTraits = async(selectedTraits:selectedTraits) => {

    const width = 1600;
    const height = width;

    const activeTraitsList = getImagePathsFromSelectedTraits(selectedTraits)
    
    if(activeTraitsList.length===0){
        const dataUrl = await mergeImages(['/traits/1600x1600/logo.png'])
        return dataUrl
    }

    const combineImages = activeTraitsList
    const dataUrl = await mergeImages(combineImages)
    return dataUrl
}