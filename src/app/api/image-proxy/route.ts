import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new NextResponse(blob, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}
