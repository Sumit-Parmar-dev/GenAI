require('dotenv').config();
const prisma = require('../config/prisma');

async function main() {
    try {
        console.log("Checking for user 1...");
        let user = await prisma.user.findUnique({ where: { id: 1 } });
        if (!user) {
            console.log("Creating default user 1...");
            user = await prisma.user.create({
                data: {
                    id: 1,
                    name: "Main User",
                    email: "user1@example.com",
                    password: "hashed_password"
                }
            });
        }

        console.log("Attempting to create lead...");
        const lead = await prisma.lead.create({
            data: {
                company: "Test Co",
                projectTitle: "Test Title",
                source: "Manual Test",
                user: { connect: { id: 1 } }
            }
        });
        console.log("Lead created SUCCESS:", lead.id);
    } catch (err) {
        console.error("CREATE ERROR DETAILED:");
        console.error(err);
        if (err.meta) {
            console.error("META DETAILS:");
            console.error(JSON.stringify(err.meta, null, 2));
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
