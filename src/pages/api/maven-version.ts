export async function GET({ url }: { url: URL }) {
    const groupId = url.searchParams.get('group');
    const artifactId = url.searchParams.get('artifact');

    if (!groupId || !artifactId) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    try {
        const response = await fetch(`https://repo1.maven.org/maven2/${groupId.replace(/\./g, '/')}/${artifactId}/maven-metadata.xml`);
        const text = await response.text();
        const version = (text.match(/<latest>(.*?)<\/latest>/) || text.match(/<release>(.*?)<\/release>/))?.[1];

        if (!version) {
            return new Response(JSON.stringify({ error: 'Version not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ version }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch version' }), { status: 500 });
    }
}
