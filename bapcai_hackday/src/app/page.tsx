import Image from 'next/image'
import bapcai from "../../public/Bapcaiteam.jpg"
export default function Home() {
  return (
    <div className='max-h-'>

    <div className='grid grid-rows-3'>
      <h1 className='row-span-1 text-4xl md:text-9xl text-green-500 uppercase'>Say Hi to SOLANA HACKATHON 05</h1>

      <Image className='row-span-2 w-full object-contain' src={bapcai} alt="Bapcai" />
    </div>
    </div>


  )
}
