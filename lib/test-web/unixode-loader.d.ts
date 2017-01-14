export interface Mapping {
    unixode: string;
    english: string;
    xharish: string;
    pairs?: {
        english: string;
        xharish: string;
    }[];
}
export interface Word extends Mapping {
}
export declare function loadUnixode(document: string): {
    mappings: Mapping[];
    words: Word[];
};
