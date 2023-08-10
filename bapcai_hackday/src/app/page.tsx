import Image from "next/image";
import bapcai from "../../public/Bapcaiteam.jpg";
export default function Home() {
  return (
    <div className="max-h-">
      <div className="grid grid-rows-3">
        <p className="row-span-1 text-4xl md:text-8xl text-green-500 uppercase">
          BAP CAI HACKATHON Say Hi to SOLANA HACKATHON 05
        </p>

        <Image
          className="row-span-2 w-full object-contain"
          src={bapcai}
          alt="Bapcai"
        />
      </div>
    </div>
  );
}
