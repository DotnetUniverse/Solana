"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
import { Networks } from "@/config/enum"
import { mintNFT, mintNFTV2, upload, uploadMetadata } from "../../shared/shyft"
import ConnectWalletButton from "@/components/wallet/ConnectWalletButton"
import { NetworkSelect } from "@/components/wallet/network-select"
// import { AspectRatio } from "./ui/aspect-ratio"
// import { useToast } from "@/components/ui/toaster"
import { Uploader } from "@/components/ui/uploader"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

const formSchema = z.object({
  image: z.any().refine((file) => !!file, "Image is required."),
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),
  description: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(1000, `The maximum allowed length for this field is 1000 characters`),
  externalUrl: z.string().trim().max(256, `The maximum allowed length for this field is 256 characters`).optional(),
  max_supply:z.number(),
  collectionAddress: z.string().trim().optional(),
  attributes: z
    .array(
      z.object({
        trait_type: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(10, `The maximum allowed length for this field is 10 characters`),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(32, `The maximum allowed length for this field is 32 characters`),
      })
    )
    .optional(),
  network: z.enum(Networks),
})

export function CreateEventForm() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      externalUrl: "",
      max_supply: 0,
      collectionAddress: "",
      network: "devnet",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)

      if (!publicKey) {
        toast({
          variant: "destructive",
          title: "Please connect to your wallet",
        })
        return
      }

      const uploadResponse = await upload(values.image)

      if (!uploadResponse.success) {
        toast({
          variant: "destructive",
          title: "Upload error",
          description: uploadResponse.message ?? "Unknown error",
        })
        return
      }

      const response = await mintNFTV2({
        creator_wallet: publicKey.toBase58(),
        name: values.name,
        symbol: values.symbol,
        collection_address: values.collectionAddress,
        fee_payer: publicKey.toBase58(),
        network: values.network,
        description: values.description??"",
        max_supply: values.max_supply,
        image: uploadResponse.result.uri,
        external_url: values.externalUrl ?? "",
        attributes: values.attributes ?? [],
        files: [
          {
            uri: uploadResponse.result.uri,
            type: "image/png",
          },
        ],
        royalty: 500, // 5%
      })

      // if (response.success) {
      //   const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
      //   const signature = await sendTransaction(tx, connection)
      //   await connection.confirmTransaction(signature, "confirmed")

      //   toast({
      //     variant: "default",
      //     title: "Your NFT minted successfully",
      //     description: (
      //       <a
      //         className="underline"
      //         target="_blank"
      //         rel="noopener noreferrer"
      //         href={`https://translator.shyft.to/tx/${signature}?cluster=${values.network}`}
      //       >
      //         View transaction
      //       </a>
      //     ),
      //   })
      // } else {
      //   toast({
      //     variant: "destructive",
      //     title: "Error :(",
      //     description: response.message ?? "Unknown error",
      //   })
      // }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error :(",
        description: error?.message ?? "Unknown error",
      })
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-2xl shadow-card flex flex-col gap-5 p-5 mb-5">
            {/* image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full max-w-[240px]">
                  <FormLabel>Your Events NFT Image</FormLabel>
                  <AspectRatio ratio={1 / 1}>
                    <Uploader
                      {...field}
                      className="h-full"
                      maxFiles={1}
                      accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                      }}
                      onExceedFileSize={() => form.setError("image", { message: "Max file size is 5MB" })}
                      value={field.value ? [field.value] : []}
                      onChange={(files) => {
                        field.onChange(files?.[0])
                      }}
                    />
                  </AspectRatio>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Your Event NFT Name</FormLabel>
                  <FormControl>
                    <Input placeholder="NFT name"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* symbol */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Your Event NFT Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="NFT symbol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Your Event NFT Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder="NFT description"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* external url */}
            <FormField
              control={form.control}
              name="externalUrl"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>External URL For Your Event</FormLabel>
                  <FormControl>
                    <Input placeholder="External URL (optional)"{...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Max supply */}
            <FormField
              control={form.control}
              name="max_supply"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Your Event NFT Quantity</FormLabel>
                  <FormControl>
                    <Input  placeholder="Max subpply (optional)"{...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Maximum amount of a NFT
                  </FormDescription>
                </FormItem>
              )}
            />


            {/* collection address */}
            <FormField
              control={form.control}
              name="collectionAddress"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Collection address</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection address (optional)"  {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    On-chain address of the collection represented by an NFT, with max_supply of 0.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* attributes */}
            {fields.map((field, index) => (
              <div className="flex w-full items-center gap-6" key={field.id}>
                <FormField
                  control={form.control}
                  name={`attributes.${index}.trait_type`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Trait type</FormLabel>
                      <FormControl>
                        <Input className="w-100" placeholder="Trait type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attributes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input className="w-100" placeholder="Trait value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    remove(index)
                  }}
                  className="shrink-0 self-end"
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}

            <Button
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                append({ trait_type: "", value: "" })
              }}
              size="sm"

              className="self-start"
            >
              Add attributes
            </Button>
            {/* network */}
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <NetworkSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                    </NetworkSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            {form.formState.isSubmitting ? "loading..." : ""}
            {connected ? (
              <Button type="submit">
                Create
              </Button>
            ) : (
              <ConnectWalletButton>Connect Wallet</ConnectWalletButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
