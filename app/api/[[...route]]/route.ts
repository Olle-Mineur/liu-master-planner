import { serve } from '@hono/node-server'
import { Hono } from 'hono'
//import { handle } from '@hono/node-server/vercel'

export const runtime = 'nodejs';

const app = new Hono({ strict: false }).basePath('/api')

app.get('/hello', async (c) => {
    return c.json({
        message: 'Hello Next.js!',
    });
});

app.notFound((c) => {
    return c.text('Något gick verkligen fel 404', 404)
})

app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('Något gick fel', 500)
})

// TODO: Fix why it needs different port
export const GET = serve({
    fetch: app.fetch,
    port: 3500,
    hostname: 'localhost',
    //https: true,
})

//export const GET = handle(app)
//export const POST = handle(app)