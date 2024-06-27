// pages/api/csrf-token.js
import { NextResponse } from 'next/server';

export default function handler(req, res) {
    if (req.method === 'GET') {
        return NextResponse.json({ csrfToken: req.cookies['XSRF-TOKEN'] });
    }
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
