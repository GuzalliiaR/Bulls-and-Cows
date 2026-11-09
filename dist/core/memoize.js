export function memoize(fn) {
    const cache = new Map();
    return (length, base) => {
        const key = `${length}:${base}`;
        const cached = cache.get(key);
        if (cached !== undefined)
            return cached;
        const value = fn(length, base);
        cache.set(key, value);
        return value;
    };
}
//# sourceMappingURL=memoize.js.map