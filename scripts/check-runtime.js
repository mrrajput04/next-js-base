if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Edge runtime is not supported for this application');
} 