const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())

module.exports = server
