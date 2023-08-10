import { BurnNFTForm } from "@/components/form/burn-nft";

export default function Page() {
      return(<>
        <div className="mb-10">
          <p className="mb-2 font-bold 2xl">
            Burn cNFT
          </p>
        </div>
        <BurnNFTForm />
      </>) 
      ;
    }