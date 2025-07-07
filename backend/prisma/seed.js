//This file will be used to seed the database with initial data for testing purposes.

const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const player = {
	firstName: "Billy",
	lastName: "Bob",
	yearsOfExperience: "0",
	location: "US",
	willingToRelocate: false,
}
const team = {
	name: "Unlimited Range Gaming",
    location: "US",
    description: "FPS focused e-sports Team",
    overview: "We are a team of FPS players looking to expand our reach and grow our community.",
    yearEstablished: "2022",
    currentlyHiring: true,
}

async function main() {
    await prisma.account.create({
        data: {
            accountType: "player",
			email: "billybob@bob.com",
            player: {
                create: {
                    firstName: "Billy",
                    lastName: "Bob",
                    yearsOfExperience: "0",
                    location: "US",
                    willingToRelocate: false,
                    bio: "#1 ranked player in the US | FPS certified | Full-time",
                    about: "Hello!, I'm a FPS player looking to expand my reach and grow my community. I'm currently looking for a team to join and help me achieve my goals.",
                }
            }
        }
    })

    await prisma.account.create({
        data: {
            accountType: "team",
			email: "URG@gmail.com",
            team: {
                create: team
            }
        }
    })
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
