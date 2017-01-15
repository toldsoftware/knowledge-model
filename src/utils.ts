export function forprops<T>(obj: { [key: string]: T }, callback: (t: T, k: string) => void) {
    for (let k in obj) {
        callback(obj[k], k);
    }
}