/**
 * Response Cache - Speed Optimization
 * Caches common LLM responses, uses local-first approach
 */

import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

interface CacheEntry {
  key: string;
  prompt: string;
  response: string;
  timestamp: number;
  expiresAt: number;
  provider: string;
  model: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
}

export class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheDir: string;
  private maxEntries: number = 100;
  private defaultTTL: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor(cacheDir: string) {
    this.cacheDir = path.join(cacheDir || '', '.quantum', 'cache');
    this.loadCache();
  }

  // Generate cache key from prompt
  private generateKey(prompt: string, model: string): string {
    const normalized = prompt.toLowerCase().trim().substring(0, 200);
    const hash = crypto.createHash('md5').update(`${normalized}:${model}`).digest('hex');
    return hash;
  }

  // Load cache from disk
  private loadCache() {
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
    } catch (e) {
      console.log('Cache load error:', e);
    }
  }

  // Save cache to disk
  private saveCache() {
    const cacheFile = path.join(this.cacheDir, 'responses.json');
    const entries = Array.from(this.cache.values());
    fs.writeFileSync(cacheFile, JSON.stringify(entries, null, 2));
  }

  // Check if cached response exists and is valid
  get(prompt: string, model: string): string | null {
    const key = this.generateKey(prompt, model);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  // Store response in cache
  set(prompt: string, response: string, model: string, ttl: number = this.defaultTTL) {
    const key = this.generateKey(prompt, model);
    
    // Evict old entries if cache is full
    if (this.cache.size >= this.maxEntries) {
      this.evictOldest();
    }

    const entry: CacheEntry = {
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
  private evictOldest() {
    let oldest: string | null = null;
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
  invalidate(model?: string) {
    if (model) {
      for (const [key, entry] of this.cache.entries()) {
        if (entry.model === model) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    this.saveCache();
  }

  // Get cache statistics
  getStats(): CacheStats {
    let hits = 0;
    let misses = 0;
    let size = 0;

    for (const entry of this.cache.values()) {
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(entry.key);
      } else {
        size += entry.response.length;
      }
    }

    return { hits, misses, size };
  }

  // Smart cache: check partial matches for similar prompts
  getSimilar(prompt: string, threshold: number = 0.8): string | null {
    const normalized = prompt.toLowerCase().trim();
    
    for (const entry of this.cache.values()) {
      if (Date.now() > entry.expiresAt) continue;
      
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