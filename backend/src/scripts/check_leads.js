const prisma = require('../config/prisma');

async function checkLeads() {
    console.log('--- Checking Leads in DB ---');
    try {
        const leadCount = await prisma.lead.count();
        console.log(`Total Leads: ${leadCount}`);

        const latestLeads = await prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                company: true,
                email: true,
                source: true,
                createdAt: true
            }
        });

        if (latestLeads.length === 0) {
            console.log('No leads found in the database.');
        } else {
            console.log('Latest 5 Leads:');
            console.table(latestLeads);
        }
    } catch (err) {
        console.log("error", err);
    } finally {
        await prisma.$disconnect();
    }
}

checkLeads();
