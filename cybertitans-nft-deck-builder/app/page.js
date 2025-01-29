import DeckBuilder from "./deck-builder";
import { utapi } from "./server/uploadthing/uploadthing";
import { prisma } from "@/client"
import { titanCard } from "./utils/titan-card";
import { ItemDraggable } from "./_board/item";

const red = 'invert(22%) sepia(96%) saturate(5375%) hue-rotate(355deg) brightness(92%) contrast(121%)'
const blue = 'invert(8%) sepia(100%) saturate(7230%) hue-rotate(248deg) brightness(95%) contrast(144%)'
const yellow = 'invert(97%) sepia(56%) saturate(2855%) hue-rotate(333deg) brightness(101%) contrast(102%)'


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

  const items = await prisma.item.findMany()

  let itemsData = {}
  items.forEach((item, index) => {
    itemsData[`item.${item.name.toLowerCase()}-1`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-1`} size={45} image_url={item.image_url} color={red} description={item.description} upgrade={item.upgrade_A} />,
    itemsData[`item.${item.name.toLowerCase()}-2`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-2`} size={45} image_url={item.image_url} color={blue}  description={item.description} upgrade={item.upgrade_B} />,
    itemsData[`item.${item.name.toLowerCase()}-3`] = <ItemDraggable id={`item.${item.name.toLowerCase()}-3`} size={45} image_url={item.image_url} color={yellow}  description={item.description} upgrade={item.upgrade_C}/>
  })


  const synergies = await prisma.synergy.findMany()

  synergies.forEach((synergy, index) => {
    itemsData[`item.${synergy.name.toLowerCase()}`] = <ItemDraggable id={`item.${synergy.name.toLowerCase()}`} size={45} image_url={synergy.image_url} color={"unset"} description={""} upgrade={""}/>
  })
  
  // let titanCards = {}
  // let titansById = {}
  // titans.reduce((acc, titan, index) => {
  //   titanCards[titan.id] = titanCard(titan.image, titan.name, index, titan.id)
  //   acc[titan.id] = titan;
  // }, {});

  // console.log("titanCards", titanCards)


  // console.log(titans.length)

  return <DeckBuilder titans={titansById} titanCards={titanCards} itemsData={itemsData}/>
}