// pages/api/login.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post(`${process.env.LARAVEL_API_URL}/login`, req.body, {
                headers: {
                    'X-CSRF-TOKEN': req.cookies['XSRF-TOKEN'],
                },
            });
            res.status(response.status).json(response.data);
        } catch (error) {
            res.status(error.response.status).json(error.response.data);
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
