import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { file } = req.body;
    if (!file) {
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        // Execute the link fixer script
        const scriptPath = path.join(process.cwd(), 'scripts', 'docs', 'fix-links.ts');
        const { stdout, stderr } = await execAsync(`ts-node ${scriptPath} --file ${file}`);

        if (stderr) {
            console.error('Error fixing links:', stderr);
            return res.status(500).json({ error: 'Failed to fix links', details: stderr });
        }

        // Return success response
        return res.status(200).json({ 
            message: 'Links fixed successfully',
            details: stdout
        });

    } catch (error) {
        console.error('Error executing link fixer:', error);
        return res.status(500).json({ 
            error: 'Failed to fix links',
            details: error.message
        });
    }
} 