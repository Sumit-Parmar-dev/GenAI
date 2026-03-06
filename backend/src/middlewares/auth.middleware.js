const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Check for Scraper API Key (for automated services)
    const scraperKey = req.header('X-Scraper-Key');
    if (scraperKey && scraperKey === process.env.SCRAPER_API_KEY) {
        req.isScraper = true;
        // Optionally assign a default user for scraper activities
        req.user = { id: parseInt(process.env.DEFAULT_USER_ID || '1') };
        return next();
    }

    // 2. Standard JWT Authentication (for users)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
