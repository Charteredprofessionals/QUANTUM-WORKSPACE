/**
 * Response Cache - Speed Optimization
 * Caches common LLM responses, uses local-first approach
 */
interface CacheStats {
    hits: number;
    misses: number;
    size: number;
}
export declare class ResponseCache {
    private cache;
    private cacheDir;
    private maxEntries;
    private defaultTTL;
    constructor(cacheDir: string);
    private generateKey;
    private loadCache;
    private saveCache;
    get(prompt: string, model: string): string | null;
    set(prompt: string, response: string, model: string, ttl?: number): void;
    private evictOldest;
    invalidate(model?: string): void;
    getStats(): CacheStats;
    getSimilar(prompt: string, threshold?: number): string | null;
    cleanExpired(): void;
}
export {};
//# sourceMappingURL=response-cache.d.ts.map