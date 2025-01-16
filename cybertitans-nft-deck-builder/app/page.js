import DeckBuilder from "./deck-builder";
import { utapi } from "./server/uploadthing/uploadthing";
import { prisma } from "@/client"

export default async function Home(){
  const titans = await prisma.titan.findMany();
  
  console.log(titans);

  return <DeckBuilder titans={titans}/>
}