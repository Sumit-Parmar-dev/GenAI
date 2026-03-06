const nodemailer = require('nodemailer');
const leadDao = require('../dao/lead.dao');

/**
 * Outreach Service
 * Handles sending personalized emails to leads.
 */
class OutreachService {
    constructor() {
        // Configure transporter
        const config = process.env.SMTP_SERVICE
            ? { service: process.env.SMTP_SERVICE }
            : { host: process.env.SMTP_HOST || 'smtp.ethereal.email', port: process.env.SMTP_PORT || 587 };

        this.transporter = nodemailer.createTransport({
            ...config,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(leadId, userId) {
        const lead = await leadDao.getLeadById(leadId, userId);
        if (!lead || !lead.email) {
            throw new Error('Lead not found or missing email');
        }

        const subject = `Opportunities for ${lead.company || 'your business'}`;
        const text = lead.aiEmailDraft || `Hi ${lead.name},\n\nI was impressed by your work at ${lead.company || 'your company'} and wanted to reach out...`;

        try {
            const info = await this.transporter.sendMail({
                from: `"LeadIQ Sales" <${process.env.SMTP_USER}>`,
                to: lead.email,
                subject: subject,
                text: text,
            });

            console.log(`[Outreach] Email sent to ${lead.email}: ${info.messageId}`);

            // Update lead status in DB
            await leadDao.updateLead(leadId, userId, {
                status: 'Contacted',
                notes: `${lead.notes || ''}\n[Outreach] Contacted on ${new Date().toISOString()}`
            });

            return { success: true, messageId: info.messageId };
        } catch (err) {
            console.error(`[Outreach] Failed to send to ${lead.email}:`, err.message);
            throw err;
        }
    }

    async bulkOutreach(userId, criteria = { status: 'Hot' }) {
        const leads = await leadDao.getAllLeads(userId);
        const targets = leads.filter(l => l.aiCategory === 'Hot' && l.email && l.status !== 'Contacted');

        console.log(`[Outreach] Starting bulk outreach for ${targets.length} leads...`);
        const results = [];

        for (const lead of targets) {
            try {
                const res = await this.sendEmail(lead.id, userId);
                results.push({ id: lead.id, success: true });
            } catch (err) {
                results.push({ id: lead.id, success: false, error: err.message });
            }
        }

        return results;
    }
}

module.exports = new OutreachService();
