export declare function forprops<T>(obj: {
    [key: string]: T;
}, callback: (t: T, k: string) => void): void;
