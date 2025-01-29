// Import Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB
const { utapi } = require("../app/server/uploadthing/uploadthing");


// Name	Image	Cost	Synergy 1	Synergy 2	Synergy 3
// GEARZ		0			
// ASRA			1	Desert	Demon	
// AUROR		1	Magma	Caster	
// DAPPER		1	Oceanic	Shooter	
// EMPEROR		1	Humanoid	Guardian	
// FLYNT		1	Forest	Greedy	
// MOONBEAN		1	Forest	Spirit	
// PINESCAR		1	Forest	Shieldmaiden	
// SPARK		1	Magma	Assassin	
// STALAK		1	Arctic	Weapons Master	
// ZABU			1	Electric	Weapons Master	
// BERO			2	Magma	Guardian	
// FLAKY		2	Forest	Indomitable	
// GARRARD		2	Oceanic	Greedy	
// JAECHIRAS	2	Arctic	Demon	
// K2			2	Electric	Shieldmaiden	
// KHEPRI		2	Desert	Shooter	
// ORCHID		2	Forest	Spirit	
// SYLON		2	Forest	Weapons Master	Holy
// UKIR			2	Arctic	Shooter	Demon
// ZERO			2	Humanoid	Greedy	
// GOOHOO		3	Arctic	Assassin	Indomitable
// AWON			3	Oceanic	Indomitable	
// BRIGHT		3	Electric	Demon	
// HELI			3	Oceanic	Spirit	
// KUGO			3	Electric	Caster	
// MALHAAG		4	Desert	Demon	
// NALENA		3	Oceanic	Caster	
// TANKO		3	Magma	Demon	
// VOLUNDR		3	Magma	Weapons Master	
// WHISPER		3	Humanoid	Assassin	
// CLOCKS		4	Arctic	Guardian	
// FYRE			4	Magma	Greedy	Spirit
// KALAMIS		4	Arctic	Weapons Master	
// KOR			4	Arctic	Shieldmaiden	
// MANETHO		4	Desert	Indomitable	Guardian
// OKEANOS		4	Oceanic	Guardian	
// UTAG			4	Humanoid	Demon	Weapons Master
// GAIA			5	Forest	Caster	
// KARN			5	Humanoid	Guardian	
// MAEL			5	Magma	Holy	Shieldmaiden
// MORAY		5	Oceanic	Demon	Weapons Master
// PROTONN		5	Electric	Shooter	
// SEMET		5	Desert	Assassin

const info = [
	{ id: 53, name: 'WHISPER', synergies: ["Humanoid", "Assassin"] },
	{ id: 54, name: 'TANKO', synergies: ["Magma", "Demon"] },
	{ id: 55, name: 'JAECHIRAS', synergies: ["Arctic", "Demon"] },
	{ id: 56, name: 'PINESCAR', synergies: ["Forest", "Shieldmaiden"] },
	{ id: 57, name: 'GEARZ', synergies: [] },
	{ id: 58, name: 'KHEPRI', synergies: ["Desert", "Shooter"] },
	{ id: 59, name: 'VOLUNDR', synergies: ["Magma", "Weapons Master"] },
	{ id: 60, name: 'KUGO', synergies: ["Electric", "Caster"] },
	{ id: 61, name: 'NALENA', synergies: ["Oceanic", "Caster"] },
	{ id: 46, name: 'UKIR', synergies: ["Arctic", "Shooter", "Demon"] },
	{ id: 47, name: 'MOONBEAN', synergies: ["Forest", "Spirit"] },
	{ id: 48, name: 'KARN', synergies: ["Humanoid", "Guardian"] },
	{ id: 49, name: 'KOR', synergies: ["Arctic", "Shieldmaiden"] },
	{ id: 50, name: 'PROTONN', synergies: ["Electric", "Shooter"] },
	{ id: 51, name: 'SYLON', synergies: ["Forest", "Weapons Master", "Holy"] },
	{ id: 52, name: 'ZERO', synergies: ["Humanoid", "Greedy"] },
	{ id: 62, name: 'MALHAAG', synergies: ["Desert", "Demon"] },
	{ id: 63, name: 'ORCHID', synergies: ["Forest", "Spirit"] },
	{ id: 64, name: 'SPARK', synergies: ["Magma", "Assassin"] },
	{ id: 65, name: 'MANETHO', synergies: ["Desert", "Indomitable", "Guardian"] },
	{ id: 66, name: 'K2', synergies: ["Electric", "Shieldmaiden"] },
	{ id: 67, name: 'STALAK', synergies: ["Arctic", "Weapons Master"] },
	{ id: 68, name: 'SEMET', synergies: ["Desert", "Assassin"] },
	{ id: 69, name: 'ZABU', synergies: ["Electric", "Weapons Master"] },
	{ id: 70, name: 'MAEL', synergies: ["Magma", "Holy", "Shieldmaiden"] },
	{ id: 71, name: 'UTAG', synergies: ["Humanoid", "Demon", "Weapons Master"] },
	{ id: 72, name: 'KALAMIS', synergies: ["Arctic", "Weapons Master"] },
	{ id: 73, name: 'MORAY', synergies: ["Oceanic", "Demon", "Weapons Master"] },
	{ id: 74, name: 'OKEANOS', synergies: ["Oceanic", "Guardian"] },
	{ id: 75, name: 'EMPEROR', synergies: ["Humanoid", "Guardian"] },
	{ id: 76, name: 'FLYNT', synergies: ["Forest", "Greedy"] },
	{ id: 77, name: 'BERO', synergies: ["Magma", "Guardian"] },
	{ id: 78, name: 'HELI', synergies: ["Oceanic", "Spirit"] },
	{ id: 79, name: 'GAIA', synergies: ["Forest", "Caster"] },
	{ id: 80, name: 'CLOCKS', synergies: ["Arctic", "Guardian"] },
	{ id: 81, name: 'DAPPER', synergies: ["Oceanic", "Shooter"] },
	{ id: 82, name: 'AWON', synergies: ["Oceanic", "Indomitable"] },
	{ id: 83, name: 'FYRE', synergies: ["Magma", "Greedy", "Spirit"] },
	{ id: 84, name: 'BRIGHT', synergies: ["Electric", "Demon"] },
	{ id: 85, name: 'GOOHOO', synergies: ["Arctic", "Assassin", "Indomitable"] },
	{ id: 86, name: 'FLAKY', synergies: ["Forest", "Indomitable"] },
	{ id: 87, name: 'GARRARD', synergies: ["Oceanic", "Greedy"] },
	{ id: 88, name: 'ASRA', synergies: ["Desert", "Demon"] },
	{ id: 89, name: 'AUROR', synergies: ["Magma", "Caster"] }
]


async function main() {
	const titanPrices = [
		{ name: 'GEARZ', cost: 0 },
		{ name: 'ASRA', cost: 1 },
		{ name: 'AUROR', cost: 1 },
		{ name: 'DAPPER', cost: 1 },
		{ name: 'EMPEROR', cost: 1 },
		{ name: 'FLYNT', cost: 1 },
		{ name: 'MOONBEAN', cost: 1 },
		{ name: 'PINESCAR', cost: 1 },
		{ name: 'SPARK', cost: 1 },
		{ name: 'STALAK', cost: 1 },
		{ name: 'ZABU', cost: 1 },
		{ name: 'BERO', cost: 2 },
		{ name: 'FLAKY', cost: 2 },
		{ name: 'GARRARD', cost: 2 },
		{ name: 'JAECHIRAS', cost: 2 },
		{ name: 'K2', cost: 2 },
		{ name: 'KHEPRI', cost: 2 },
		{ name: 'ORCHID', cost: 2 },
		{ name: 'SYLON', cost: 2 },
		{ name: 'UKIR', cost: 2 },
		{ name: 'ZERO', cost: 2 },
		{ name: 'GOOHOO', cost: 3 },
		{ name: 'AWON', cost: 3 },
		{ name: 'BRIGHT', cost: 3 },
		{ name: 'HELI', cost: 3 },
		{ name: 'KUGO', cost: 3 },
		{ name: 'MALHAAG', cost: 4 },
		{ name: 'NALENA', cost: 3 },
		{ name: 'TANKO', cost: 3 },
		{ name: 'VOLUNDR', cost: 3 },
		{ name: 'WHISPER', cost: 3 },
		{ name: 'CLOCKS', cost: 4 },
		{ name: 'FYRE', cost: 4 },
		{ name: 'KALAMIS', cost: 4 },
		{ name: 'KOR', cost: 4 },
		{ name: 'MANETHO', cost: 4 },
		{ name: 'OKEANOS', cost: 4 },
		{ name: 'UTAG', cost: 4 },
		{ name: 'GAIA', cost: 5 },
		{ name: 'KARN', cost: 5 },
		{ name: 'MAEL', cost: 5 },
		{ name: 'MORAY', cost: 5 },
		{ name: 'PROTONN', cost: 5 },
		{ name: 'SEMET', cost: 5 }
	  ];
	
	
	  for (const titan of titanPrices) {
		await prisma.titan.updateMany({
		  where: { name: titan.name },
		  data: { cost: titan.cost }
		});
	  }	

	// const titans = await prisma.titan.findMany()
	
		

}

// Execute the main function and handle disconnection and errors
main()
	.then(() => prisma.$disconnect()) // Disconnect from the database on successful completion
	.catch(async (e) => {
		console.error(e); // Log any errors
		await prisma.$disconnect(); // Ensure disconnection even if an error occurs
		process.exit(1); // Exit the process with an error code
	});
