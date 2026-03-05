/**
 * ML Service client — calls the FastAPI scoring service.
 * Uses Node 18+ native fetch. Silently returns null on failure
 * so lead creation never breaks if ML service is down.
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function scoreLead(leadData) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${ML_SERVICE_URL}/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: leadData.name,
                email: leadData.email,
                phone: leadData.phone,
                company: leadData.company,
                jobRole: leadData.jobRole,
                industry: leadData.industry,
                budget: leadData.budget ? Number(leadData.budget) : null,
                source: leadData.source,
                notes: leadData.notes,
                status: leadData.status,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        console.warn('[ML Service] Scoring skipped:', err.message);
        return null;
    }
}

module.exports = { scoreLead };
