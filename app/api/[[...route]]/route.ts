import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'

export const runtime = 'nodejs';

const app = new Hono().basePath('/api')

app.get('/hello', async (c) => {
    return c.json({
        message: 'Hello Next.js!',
    });
});

export const GET = handle(app)
//export const POST = handle(app)