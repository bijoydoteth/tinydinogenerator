// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitImageLocation } from '../../../components/helpers';

type Data = any

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // api example: /api/getTraitAsset?traitName=body&traitValue=blue
    const { traitName, traitValue }:any = req.query;
    const imagePath = `${getTraitImageLocation(traitName, traitValue,1600)}`;
    
    res.status(200);
    res.setHeader('Content-Type', 'image/png');
    res.send(imagePath);
    
}
