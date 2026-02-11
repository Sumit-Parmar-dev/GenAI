const prisma = require('../config/prisma');

class LeadDao {
    async createLead(leadData) {
        return await prisma.lead.create({
            data: leadData,
        });
    }

    async getAllLeads(userId) {
        return await prisma.lead.findMany({
            where: { userId },
        });
    }
}

module.exports = new LeadDao();
