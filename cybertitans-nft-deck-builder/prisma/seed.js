// Import Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

// Define the main function that will handle database operations
async function main() {
	// Create a new user in the database using Prisma Client
	const titan1 = await prisma.titan.create({
        data: {
            name: "dummy1"
        }
    })

	// Output the email of the newly created user
	console.log(`Created user: ${titan1.name}`);
}

// Execute the main function and handle disconnection and errors
main()
	.then(() => prisma.$disconnect()) // Disconnect from the database on successful completion
	.catch(async (e) => {
		console.error(e); // Log any errors
		await prisma.$disconnect(); // Ensure disconnection even if an error occurs
		process.exit(1); // Exit the process with an error code
	});
