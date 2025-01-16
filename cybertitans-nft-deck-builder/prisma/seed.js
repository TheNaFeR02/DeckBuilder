// Import Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB
const { utapi } = require("../app/server/uploadthing/uploadthing");


async function main() {
	// files: [
	// 	{
	// 	  id: 'f926d48b-15ed-41da-997a-f1a5104fe18c',
	// 	  customId: null,
	// 	  key: 'AA3xkTQET8So7YjT83iKPQh51auw7ytczNvCpMeLqHZO0nX9',
	// 	  name: 'UKIR.png',
	// 	  size: 1049450,
	// 	  status: 'Uploaded',
	// 	  uploadedAt: 1736880469000
	// 	},
	// 	{
	// 	  id: 'dbb3d420-6b61-477a-8541-c52d92f6b8e7',
	// 	  customId: null,
	// 	  key: 'AA3xkTQET8So6XBoUf7mzgcx40Chv2prAtTlbN3V5ZdjXsDo',
	// 	  name: 'MOONBEAN.png',
	// 	  size: 767162,
	// 	  status: 'Uploaded',
	// 	  uploadedAt: 1736880469000
	// 	},

	const APP_ID = "jy37vuigv8"

	const {files} = await utapi.listFiles();

	for (const file of files) {

        const titan = await prisma.titan.create({
            data: {
                name: file.name,
                image_url: `https://${APP_ID}.ufs.sh/f/${file.key}`
            }
        })

        console.log(`Updated titan: ${titan}`);
    }

}

// Execute the main function and handle disconnection and errors
main()
	.then(() => prisma.$disconnect()) // Disconnect from the database on successful completion
	.catch(async (e) => {
		console.error(e); // Log any errors
		await prisma.$disconnect(); // Ensure disconnection even if an error occurs
		process.exit(1); // Exit the process with an error code
	});
