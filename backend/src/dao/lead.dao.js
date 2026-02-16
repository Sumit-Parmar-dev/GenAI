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

    async getLeadById(id, userId) {
        return await prisma.lead.findFirst({
            where: { id: parseInt(id), userId },
        });
    }

    async updateLead(id, userId, data) {
        return await prisma.lead.update({
            where: { id: parseInt(id), userId },
            data,
        });
    }
}

module.exports = new LeadDao();
