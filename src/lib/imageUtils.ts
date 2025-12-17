/**
 * Fetches an image from a URL, converts it to a Blob, and returns a Base64 Data URL.
 * This ensures the image is "safe" for canvas export by bypassing CORS issues during the draw phase.
 */
export async function fetchSafeImage(url: string): Promise<string> {
    if (!url) return "";
    if (url.startsWith("data:")) return url; // Already safe

    try {
        // Use a proxy if needed, or fetch directly if CORS allows
        // For this app, we'll try direct fetch first, then fallback to proxy if we had one.
        // Since we don't have a backend proxy set up in this snippet, we'll assume direct fetch
        // or a simple client-side fetch. 
        // Ideally, we should use the /api/image-proxy we saw earlier if it exists.

        // In static export mode, we cannot use the API proxy.
        // We attempt a direct fetch. If CORS blocks it, we catch the error below and return the original URL.
        const response = await fetch(url, { mode: 'cors' });

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to convert blob to base64"));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn("Failed to fetch safe image:", url, error);
        // Fallback to original URL if fetch fails (might still work if CORS is open)
        return url;
    }
}
