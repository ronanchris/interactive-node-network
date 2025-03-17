import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { issueId } = req.body;
    if (!issueId) {
        return res.status(400).json({ error: 'Issue ID is required' });
    }

    try {
        // Read the current health report
        const reportPath = path.join(process.cwd(), 'docs', 'status', 'health-report.json');
        const reportContent = await fs.readFile(reportPath, 'utf-8');
        const report = JSON.parse(reportContent);

        // Find and remove the resolved issue
        report.issues = report.issues.filter(issue => issue.id !== issueId);

        // Update metrics
        const totalIssues = report.issues.length;
        report.metrics.coverage = Math.min(100, report.metrics.coverage + 5);
        report.overallScore = Math.min(100, report.overallScore + 2);

        // Write the updated report
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Return success response
        return res.status(200).json({ 
            message: 'Issue marked as resolved',
            metrics: {
                totalIssues,
                coverage: report.metrics.coverage,
                overallScore: report.overallScore
            }
        });

    } catch (error) {
        console.error('Error marking issue as resolved:', error);
        return res.status(500).json({ 
            error: 'Failed to mark issue as resolved',
            details: error.message
        });
    }
} 