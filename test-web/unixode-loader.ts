
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

export function loadUnixode(document: string) {

    let parts = document.split('### WORDS:');
    let mappings: Mapping[] = parts[0].split('\n').filter(x => x.trim().length > 0).map(x => {

        let partsA = x.split(':');
        let partsB = partsA[1].split('=');

        let unixode = partsA[0];
        let english = partsB[0];
        let xharish = partsB[1];

        return {
            unixode: unixode,
            english: english,
            xharish: xharish,
        };
    });

    let lookup: { [key: string]: Mapping } = {};

    mappings.forEach(x2 => lookup[x2.unixode] = x2);

    let words: Word[] = parts[1].split('\n').filter(x => x.trim().length > 0).map(x => {

        let lookups = x.split('').filter(x2 => x2.trim().length > 0).map(x2 => lookup[x2]);

        return {
            unixode: x,
            pairs: x.split('').map(x2 => ({
                english: lookup[x2] ? lookup[x2].english : '',
                xharish: lookup[x2] ? lookup[x2].xharish : ''
            })).filter(x2 => x2.english !== '' || x2.xharish !== ''),
            english: lookups.map(x2 => x2.english).join(''),
            xharish: lookups.map(x2 => x2.xharish).join(''),
        };
    });

    return {
        mappings: mappings,
        words: words
    };
}