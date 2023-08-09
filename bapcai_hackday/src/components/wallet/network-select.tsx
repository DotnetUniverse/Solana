import { SelectProps } from "@radix-ui/react-select"
import React, { PropsWithChildren } from "react"

type NetworkSelect = SelectProps & PropsWithChildren

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export function NetworkSelect({ children, ...rest }: SelectProps) {
  return (
    <Select {...rest}>
      {children}
      <SelectContent position="popper">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a network" />
        </SelectTrigger>
        <SelectGroup>
          <SelectLabel>Networks</SelectLabel>
          <SelectItem value="mainnet-beta">Mainnet</SelectItem>
          <SelectItem value="devnet">Devnet</SelectItem>
          <SelectItem value="testnet">Testnet</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>


  )
}
