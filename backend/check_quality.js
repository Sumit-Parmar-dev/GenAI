const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            projectTitle: true,
            email: true,
            website: true,
            leadType: true,
            source: true,
            aiScore: true
        }
    });
    console.log(JSON.stringify(leads, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
