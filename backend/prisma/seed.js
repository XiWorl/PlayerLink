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
                }
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
