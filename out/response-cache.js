"use strict";
/**
 * Response Cache - Speed Optimization
 * Caches common LLM responses, uses local-first approach
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCache = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
class ResponseCache {
    constructor(cacheDir) {
        this.cache = new Map();
        this.maxEntries = 100;
        this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
        this.cacheDir = path.join(cacheDir || '', '.quantum', 'cache');
        this.loadCache();
    }
    // Generate cache key from prompt
    generateKey(prompt, model) {
        const normalized = prompt.toLowerCase().trim().substring(0, 200);
        const hash = crypto.createHash('md5').update(`${normalized}:${model}`).digest('hex');
        return hash;
    }
    // Load cache from disk
    loadCache() {
        try {
            if (!fs.existsSync(this.cacheDir)) {
                fs.mkdirSync(this.cacheDir, { recursive: true });
                return;
            }
            const cacheFile = path.join(this.cacheDir, 'responses.json');
            if (fs.existsSync(cacheFile)) {
                const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
                for (const entry of data) {
                    this.cache.set(entry.key, entry);
                }
            }
        }
        catch (e) {
            console.log('Cache load error:', e);
        }
    }
    // Save cache to disk
    saveCache() {
        const cacheFile = path.join(this.cacheDir, 'responses.json');
        const entries = Array.from(this.cache.values());
        fs.writeFileSync(cacheFile, JSON.stringify(entries, null, 2));
    }
    // Check if cached response exists and is valid
    get(prompt, model) {
        const key = this.generateKey(prompt, model);
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        // Check expiration
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.response;
    }
    // Store response in cache
    set(prompt, response, model, ttl = this.defaultTTL) {
        const key = this.generateKey(prompt, model);
        // Evict old entries if cache is full
        if (this.cache.size >= this.maxEntries) {
            this.evictOldest();
        }
        const entry = {
            key,
            prompt: prompt.substring(0, 100), // Store truncated prompt for debugging
            response,
            timestamp: Date.now(),
            expiresAt: Date.now() + ttl,
            provider: 'unknown',
            model
        };
        this.cache.set(key, entry);
        this.saveCache();
    }
    // Evict oldest entry
    evictOldest() {
        let oldest = null;
        let oldestTime = Infinity;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldest = key;
            }
        }
        if (oldest) {
            this.cache.delete(oldest);
        }
    }
    // Invalidate cache (when model changes or user requests)
    invalidate(model) {
        if (model) {
            for (const [key, entry] of this.cache.entries()) {
                if (entry.model === model) {
                    this.cache.delete(key);
                }
            }
        }
        else {
            this.cache.clear();
        }
        this.saveCache();
    }
    // Get cache statistics
    getStats() {
        let hits = 0;
        let misses = 0;
        let size = 0;
        for (const entry of this.cache.values()) {
            if (Date.now() > entry.expiresAt) {
                this.cache.delete(entry.key);
            }
            else {
                size += entry.response.length;
            }
        }
        return { hits, misses, size };
    }
    // Smart cache: check partial matches for similar prompts
    getSimilar(prompt, threshold = 0.8) {
        const normalized = prompt.toLowerCase().trim();
        for (const entry of this.cache.values()) {
            if (Date.now() > entry.expiresAt)
                continue;
            // Simple similarity check: does prompt contain cached prompt?
            if (normalized.includes(entry.prompt.toLowerCase())) {
                return entry.response;
            }
        }
        return null;
    }
    // Clear expired entries
    cleanExpired() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
        this.saveCache();
    }
}
exports.ResponseCache = ResponseCache;
