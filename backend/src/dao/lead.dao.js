const prisma = require('../config/prisma');

class LeadDao {
    async createLead(leadData) {
        const { userId, ...data } = leadData;
        return await prisma.lead.create({
            data: {
                ...data,
                user: { connect: { id: parseInt(userId) } }
            },
        });
    }

    async getAllLeads(userId) {
        return await prisma.lead.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getLeadById(id, userId) {
        return await prisma.lead.findFirst({
            where: { id: parseInt(id), userId },
        });
    }

    async getLeadsByStatus(userId, status) {
        return await prisma.lead.findMany({
            where: { userId, status },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateLead(id, userId, data) {
        return await prisma.lead.update({
            where: { id: parseInt(id), userId },
            data,
        });
    }

    async deleteLead(id, userId) {
        return await prisma.lead.delete({
            where: { id: parseInt(id), userId },
        });
    }
}

module.exports = new LeadDao();
