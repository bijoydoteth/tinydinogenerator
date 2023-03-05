// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { selectedTraits } from '../../../components/dinoInterface';
import { convertInputTraitsToSelectedTraits, convertSelectedTraitsToInputTraits, emptyTraits } from '../../../components/helpers';

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // api example: /api/getDinoName?body=blue&background=pink&chest=blue&eyes=dark-red&feet=hoverboard&hands=kite&spikes=blue
    
    let traits = req.query;

    const selectedTraits = (convertInputTraitsToSelectedTraits(traits))
    const userTraitInput = convertSelectedTraitsToInputTraits(selectedTraits)

    let traitString = '';
    let promptInput = '';
    const getNames = async (selectedTraits:selectedTraits) => {

        for (const trait of selectedTraits){
            if(trait.traitValue!=='none'){
                traitString += `${trait.traitName} is ${trait.traitValue},`;
            }
        }

        traitString = traitString.slice(0, -1);

        promptInput = `Give this tiny dino character a descriptive name, traits given below,starting with a phrase 'a tiny dino',with cute style, no long words, answer in simple plain english with no special charactersbetween 10-20 words, traits: ${traitString}`;

        const data = {
            model: 'gpt-3.5-turbo',
            messages:[{"role": "user", "content": promptInput}],
            max_tokens: 100,
          };
          
        const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        };
        
        try{   
            const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
            const responseChoices = (response.data.choices).map((e: { message: { content: any; }; })=>e.message.content.replace(/[^\w\s,]|_/g, '').replace(/\s+/g, ' '))[0];   
            return responseChoices
            

        }catch(err:any){
            console.log(err.response);
            // send error response
            res.status(500);
            return res.json({error:err.response});
              
        }
        
    }

    const result = await getNames(selectedTraits)
    
    res.status(200);
    res.json({traits:userTraitInput, description:result,asked:promptInput});

    
}
