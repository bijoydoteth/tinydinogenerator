import styles from '@/styles/Home.module.css'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import Dinogenerator from '../../components/Dinogenerator'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Dino Generator</title>
        <meta name="description" content="Generate your tiny dinos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='p-4'>
        <div className=''>
          Hello Dino
          <Dinogenerator />
        </div>
      </main>
      <footer className='text-center'>
        <p> Made with ❤️ by <a href='https://twitter.com/bijoydoteth' target="_blank" className='text-blue-500 hover:underline'>bijoy</a> for the community. <a href='https://github.com/tinydinosnft/tinydinosassets' target="_blank" className='text-blue-500 hover:underline'> Tiny Dino Assets</a></p>
        <p>This website is open-sourced. 
          <a href='https://github.com/ho4848/poolmynft' target="_blank" className='text-blue-500 hover:underline'>Source Code</a>
          
        </p>
      </footer>
    </>
  )
}
