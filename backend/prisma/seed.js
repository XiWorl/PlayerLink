//This file is used to seed the database with initial data for testing purposes. Will be removed in production.

const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const generatedTeamInfo = {
	name: "Unlimited Range Gaming",
	location: "US",
	description: "FPS focused e-sports Team",
	overview:
		"We are a team of FPS players looking to expand our reach and grow our community.",
	yearEstablished: "2022",
	currentlyHiring: true,
}

const generatedPlayerInfo = {
	firstName: "Billy",
	lastName: "Bob",
	yearsOfExperience: "0",
	location: "US",
	willingToRelocate: false,
	bio: "#1 ranked player in the US | FPS certified | Full-time",
	about: "Hello!, I'm a FPS player looking to expand my reach and grow my community. I'm currently looking for a team to join and help me achieve my goals.",
}

async function main() {
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
