const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.$connect()
    .then(() => console.log('Successfully connected to the database'))
    .catch((err) => console.error('Failed to connect to the database:', err));

module.exports = prisma;
