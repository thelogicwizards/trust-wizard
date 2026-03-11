export async function generateHashKey(stateData) {
    try {
        const jsonStr = JSON.stringify(stateData);
        const textEncoder = new TextEncoder();
        const uint8Array = textEncoder.encode(jsonStr);

        const stream = new Response(uint8Array).body.pipeThrough(new CompressionStream('deflate'));
        const compressedBuffer = await new Response(stream).arrayBuffer();

        // Safer Base64 conversion to avoid call stack limits
        const bytes = new Uint8Array(compressedBuffer);
        let binaryStr = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binaryStr += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        return btoa(binaryStr);
    } catch (err) {
        console.error("Error generating Hash Key:", err);
        throw err;
    }
}

export async function parseHashKey(hashStr) {
    try {
        const binaryStr = atob(hashStr);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        const stream = new Response(bytes).body.pipeThrough(new DecompressionStream('deflate'));
        const decompressedBuffer = await new Response(stream).arrayBuffer();

        const textDecoder = new TextDecoder();
        const jsonStr = textDecoder.decode(decompressedBuffer);

        return JSON.parse(jsonStr);
    } catch (err) {
        console.error("Error parsing Hash Key:", err);
        throw err;
    }
}
