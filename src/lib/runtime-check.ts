export function ensureNodeRuntime() {
    if (typeof process === 'undefined' || !process.version) {
        throw new Error('This application requires Node.js runtime');
    }
} 