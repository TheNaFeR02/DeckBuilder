import DeckBuilder from "./deck-builder";
import { utapi } from "./server/uploadthing/uploadthing";
import { prisma } from "@/client"
import { titanCard } from "./utils/titan-card";

export default async function Home(){
  const titans = await prisma.titan.findMany(
    {
      include: {
        synergies: true
      }
    }
  );
  
  // console.log(titans.length)



  let titanCards = {}
  let titansById = {}
  titans.forEach((titan, index) => {
    // console.log("imageurl", titan.image)
    titanCards[titan.id] = titanCard(titan.image_url, titan.name, index, titan.id)
    titansById[titan.id] = titan;
  });



  // let titanCards = {}
  // let titansById = {}
  // titans.reduce((acc, titan, index) => {
  //   titanCards[titan.id] = titanCard(titan.image, titan.name, index, titan.id)
  //   acc[titan.id] = titan;
  // }, {});

  // console.log("titanCards", titanCards)


  // console.log(titans.length)

  return <DeckBuilder titans={titansById} titanCards={titanCards}/>
}