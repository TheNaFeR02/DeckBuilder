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

	const _ = {
		1: {
			description: "A Raygun is an object that will focus on boosting the titans to deal more damage to the enemies. The basic object provides: 10 to Attack and 10% Attack Speed", upgrade_A: "Raygun grants:\n+40 Damage\n+20%Attack Speed\n30% LifeSteal", upgrade_B: "Raygun grants:\n+40 Damage\n+20% Attack Speed\n+20% extra damage with basic attacks\nIf target has over 1800 Health the extra damage is +100%", upgrade_C: "Raygun grants:\n+20 Damage\n+30% Attack Speed\n+2 Range"},
		2: { description: "A Rod is an object that will focus on boosting the titans to deal more damage with their magical abilities to the enemies. The basic object provides: 20 to Cyber Damage.", upgrade_A: "Rod grants:\n+60% Cyber Damage\n+30% Cyber LifeSteal", upgrade_B: "Rod grants:\n+40% Cyber Damage\n+Basic Attacks do 60% CyberDamage", upgrade_C: "Rod grants:\n+40% Cyber Damage\n+Abilities Burn for 15 seconds"},
	3: { description: "An Extra Ammo is an object that will focus on boosting the titans to deal more damage with critical attacks. The basic object provides: 33% Probability of Critical Damage.", upgrade_A: "Extra Ammo grants:\n+100% Critical Chance\n+50% Critical Damage", upgrade_B: "Extra Ammo grants:\n+Titan Powers can be critical\n+50% Critical Chance\n+25% Critical Damage", upgrade_C: "Extra Ammo grants:\n+Critical Attacks lower enemy Defense and Cyberdefense 75% during 3 seconds\n+40% Critical Chance" },
	4: { description: "A Battery is an object that will focus on providing extra charge to the titans that hold the item. The basic object provides: 10 starting Charge and -5% maximum Charge.", upgrade_A: "Battery grants:\n+20 Starting Charge\n-10% Maximum Charge\n+20 Charge after using Titan Power", upgrade_B: "Battery grants:\n+20 Starting Charge\n-10% Maximum Charge\n+Every Basic Attack +5 Charge", upgrade_C: "Battery grants:\n+20 Starting Charge\n-10% Maximum Charge\n+Titan Power provide 400% of Charge in Shield" },
	5: { description: "A Breastplate is an object that will focus on protecting the titan from damage. The basic object provides: 20 to the Defense 100 to Health.", upgrade_A: "Breastplate grants:\n+60 Defense\n+200 Health\n+50% Critical Damage Reduction", upgrade_B: "Breastplate grants:\n+40 Defense\n+200 Health\n+200 Shield\n+25% attack speed reduction of enemy titans who are targeting the titan during 5 seconds", upgrade_C: "Breastplate grants:\n+40 Defense\n+200 Health\n+Burn until end of combat of nearby enemies" },
	6: { description: "A Force Field is an object that will focus on boosting the titans to resist the magical damage the enemies can do to them. The basic object provides: 20 Cyber Defense and 100 Health.", upgrade_A: "Force Field grants:\n+80 Cyber Defense\n+500 Health", upgrade_B: "Force Field grants:\n+40 Cyber Defense\n+300 Health\n+Titan is Elusive during the first 15 seconds of the battle", upgrade_C: "Force Field grants:\n+40 Cyber Defense\n+300 Health\n+When the titan recive mortal damage turn invulnerable during 3 seconds, then dies" },
}

const items = await prisma.item.findMany()

items.forEach(async (item, index) => {

	await prisma.item.updateMany({
		where: {
			id: item.id
		},
		data: {
			description: _[item.id].description,
			upgrade_A: _[item.id].upgrade_A,
			upgrade_B: _[item.id].upgrade_B,
			upgrade_C: _[item.id].upgrade_C
		}
	})

})

}

// Execute the main function and handle disconnection and errors
main()
	.then(() => prisma.$disconnect()) // Disconnect from the database on successful completion
	.catch(async (e) => {
		console.error(e); // Log any errors
		await prisma.$disconnect(); // Ensure disconnection even if an error occurs
		process.exit(1); // Exit the process with an error code
	});
