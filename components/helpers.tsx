// import { createCanvas, loadImage } from 'canvas';
import mergeImages from 'merge-images';
import existingDinos from '../public/traits/existingDinos.json';
import traitList from '../public/traits/traitList.json';
import { selectedTraits } from './dinoInterface';

export const buttonStyle = 'bg-gray-600 hover:bg-black text-white font-bold py-2 px-4 rounded'
export const emptyImgPath = '/traits/1600x1600/logo.png'
export const noneImgPath = '/traits/1600x1600/none.png'
export const emptyTraits:selectedTraits= traitList.map((e)=>{
    return {
        traitName:e.name,
        traitValue:'none',
        layer:e.layer,
        userLocked:false
    }
})

export const getTraitImageLocation = (traitName:string,traitValue:string,resolution:number=1600) => {
    if (traitValue==='none') return noneImgPath
    return `/traits/${resolution}x${resolution}/${traitName}/${traitValue.replace(/\s+/g, "-").toLowerCase()}.png`
}

export const getImagePathsFromSelectedTraits = (selectedTraits:selectedTraits) => {
    const imagePaths = selectedTraits.filter(e=>e.traitValue!=='none').sort((a, b) => a.layer - b.layer).map(e=>getTraitImageLocation(e.traitName,e.traitValue,1600))
    return imagePaths.length===0? [emptyImgPath]:imagePaths
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

// export const getImageFromSelectedTraitsCanvas = async(selectedTraits:selectedTraits) => {
//     const width = 1600;
//     const height = width;
//     const canvas = createCanvas(width,height)
//     const ctx = canvas.getContext('2d')

//     const imgLayerPaths = getImagePathsFromSelectedTraits(selectedTraits)

//     for (const imgPath of imgLayerPaths){
//         const img = await loadImage(imgPath)
//         ctx.drawImage(img, 0, 0,width,height)
//     }

//     const dataUrl = canvas.toDataURL()
    
//     return dataUrl
// }

const getTraitsFromDinoId = (dinoId:string) => {
    function isValidNumber(str:string) {
        const num = Number.parseInt(str, 10);
        return !Number.isNaN(num) && num >= 0 && num <= 10000;
    }
    if(!isValidNumber(dinoId)) return emptyTraits
    const dinoTraits:any = existingDinos.find(e=>e.tokenId===Number(dinoId))||{}
    // const isOneOfOne = '1/1' in Object.keys(dinoTraits)
    
    const result = emptyTraits.map(trait=>{
        
        if(Object.keys(dinoTraits).includes(trait.traitName)){
            trait.traitValue = dinoTraits[trait.traitName]
        }else{
            trait.traitValue = 'none'
        }

        return trait
    })

    return result  
}

const getImgPathFromDinoId = (dinoId:string) => {
    function isValidNumber(str:string) {
        const num = Number.parseInt(str, 10);
        return !Number.isNaN(num) && num >= 0 && num <= 10000;
    }
    if(!isValidNumber(dinoId)) return emptyImgPath

    return `/dinos/1600x1600/original/${dinoId}.png`
}

export const getTraitsAndPathFromDinoId = (dinoId:string) => {
    const traits = getTraitsFromDinoId(dinoId)
    const path = getImgPathFromDinoId(dinoId)
    return {traits,path}
}

export const findDinoIdFromTraits = (selectedTraits:selectedTraits) => {
    
    return
}