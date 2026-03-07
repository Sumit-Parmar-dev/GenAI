const prisma = require('../config/prisma');

/**
 * Hyper-Scale: Jaccard Similarity for fuzzy title matching
 * (Blocks variations like "Build SaaS dashboard" vs "SaaS Dashboard Builder")
 */
function getSimilarity(s1, s2) {
    const set1 = new Set(s1.toLowerCase().split(/\s+/));
    const set2 = new Set(s2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

class LeadDao {
    async createLead(leadData) {
        const { userId, ...data } = leadData;

        // 1. Precise & Fuzzy Deduplication
        const existingLeads = await prisma.lead.findMany({
            where: {
                userId: parseInt(userId),
                OR: [
                    { domain: data.domain && data.domain !== "" ? data.domain : "___no_domain___" },
                    { projectTitle: { contains: data.projectTitle.split(" ")[0] } }
                ]
            },
            take: 10
        });

        // Helper for normalization
        const normalizeTitle = (t) => t ? t.replace(/\d{2}\/\d{2}\/\d{4}/g, "").toLowerCase().trim() : "";
        const normNewTitle = normalizeTitle(data.projectTitle);

        for (const lead of existingLeads) {
            if (lead.domain && lead.domain === data.domain) {
                console.log(`[LeadDao] Domain duplicate blocked: ${lead.domain}`);
                return lead;
            }

            const normExistingTitle = normalizeTitle(lead.projectTitle);
            if (getSimilarity(normExistingTitle, normNewTitle) > 0.7) {
                console.log(`[LeadDao] Fuzzy title duplicate blocked: ${lead.projectTitle}`);
                return lead;
            }
        }

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

    async getSourceAnalytics(userId) {
        const sources = await prisma.lead.groupBy({
            by: ['source'],
            where: { userId: parseInt(userId) },
            _count: { _all: true },
            _avg: { aiScore: true, budgetValue: true, baseSignal: true }
        });

        const analytics = await Promise.all(sources.map(async (s) => {
            const hotCount = await prisma.lead.count({
                where: { userId: parseInt(userId), source: s.source, aiCategory: 'HOT' }
            });
            const convertedCount = await prisma.lead.count({
                where: { userId: parseInt(userId), source: s.source, isConverted: true }
            });

            return {
                source: s.source,
                totalLeads: s._count._all,
                avgScore: Math.round(s._avg.aiScore || 0),
                avgBudget: Math.round(s._avg.budgetValue || 0),
                avgSignal: Math.round(s._avg.baseSignal || 0),
                hotLeads: hotCount,
                convertedLeads: convertedCount,
                hotLeadRatio: s._count._all > 0 ? ((hotCount / s._count._all) * 100).toFixed(1) + '%' : '0%',
                conversionRate: s._count._all > 0 ? (convertedCount / s._count._all) * 100 : 0
            };
        }));

        return analytics;
    }

    async deleteLead(id, userId) {
        return await prisma.lead.delete({
            where: { id: parseInt(id), userId },
        });
    }
}

module.exports = new LeadDao();
