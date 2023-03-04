// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mergeImages from 'merge-images';
import type { NextApiRequest, NextApiResponse } from 'next';
import { useRef } from 'react';
import { selectedTraits } from '../../../components/dinoInterface';
import { emptyTraits, getImagePathsFromSelectedTraits } from '../../../components/helpers';
import traitList from '../../../public/traits/traitList.json';



type Data = {
  msg: string,
  error: boolean
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {

    const userReqConvertToSelectedTraits = (req:NextApiRequest) => {
        let status = {error: false,msg:''}

        const selectedTraits = emptyTraits.map((trait) => {
            
            if (req.query[trait.traitName] !== undefined) {
                const userInputTraitValue = req.query[trait.traitName] as string
                
                // check if the traitValue is in the trait list
                const correspondingTraitValue = traitList.filter(e=>e.name===trait.traitName)[0].value
                if (correspondingTraitValue.includes(userInputTraitValue)) {
                    trait.traitValue = userInputTraitValue
                }else{
                    console.log(`Trait ${userInputTraitValue} (in ${trait.traitName}) is not in the trait list`)
                    status.error = true
                    status.msg = `Trait ${userInputTraitValue} (in ${trait.traitName}) is not in the trait list`
                }
            }

            return trait
        })

        if(status.error) return {selectedTraits:emptyTraits,status}

        return {selectedTraits,status}
    }
    
    const result = userReqConvertToSelectedTraits(req)
    if(result.status.error) {
        res.status(400).json({ msg: result.status.msg,error:true })
        return
    }else{
        const selectedTraits = result.selectedTraits
        const imgLayerPaths = getImagePathsFromSelectedTraits(selectedTraits)
        
        
    }
    
    
    

    // This is an api to fetch a dino image
    // It will take in a dino trait and return a dino image
    // example: /api/getDino?background=blue&body=gray&chest=orangered
    res.status(200).json({ msg: 'tiny dino' ,error:false })
  }