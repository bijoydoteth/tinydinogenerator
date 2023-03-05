// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { convertInputTraitsToSelectedTraits, convertSelectedTraitsToInputTraits, getRandomTraits } from '../../../components/helpers';


type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // api example: /api/getRandomDinoTraits 
    let traits = req.query;
    const result = convertInputTraitsToSelectedTraits(traits)
    const randomTraits = getRandomTraits(result,'all')
    const outputTraits = convertSelectedTraitsToInputTraits(randomTraits);

    res.status(200);
    res.json({traits:outputTraits});

    
}
