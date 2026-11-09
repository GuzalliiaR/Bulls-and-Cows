const BASE_LABELS = {
    2: 'bin',
    8: 'oct',
    10: 'dec',
    16: 'hex',
};
export function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
export function baseLabel(base) {
    return BASE_LABELS[base] ?? String(base);
}
//# sourceMappingURL=format.js.map