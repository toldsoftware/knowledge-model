import { KnowledgeProblem, KnowledgeComponent } from './../knowledge-state';
import { createRelationshipComponentName } from './../knowledge-problems';

export interface LetterSoundPair {
    letters: string;
    sound: string;
}

export function createSpellingProblem(wordPairs: LetterSoundPair[]): KnowledgeProblem {

    let comps: string[] = [];
    let exclusives: { type: string, items: string[] }[] = [];

    let wordEnglish = wordPairs.map(x => x.letters).join('');
    for (let pair of wordPairs) {

        let letters = 'l:' + pair.letters;
        let sound = 's:' + pair.sound;

        comps.push(letters);
        comps.push(sound);
        exclusives.push({ type: 'letters_sound', items: [letters, sound] });
        comps.push(createRelationshipComponentName(letters, sound));
        comps.push(createRelationshipComponentName(letters, wordEnglish));
        // exclusives.push({ type: 'wordLetters_sound', items: [comps[comps.length - 1], sound] });
        comps.push(createRelationshipComponentName(sound, wordEnglish));

        comps.push(createRelationshipComponentName(sound, '(hear)'));
        pair.letters.split('').forEach(c => comps.push(createRelationshipComponentName('l:' + c, '(type)')));
        if (pair.letters.length > 0) { pair.letters.split('').forEach(c => comps.push(createRelationshipComponentName('l:' + c, '(read)'))); }
        comps.push(createRelationshipComponentName(letters, '(read)'));
    }

    let keys = {} as any;
    comps = comps.filter(x => {
        if (keys[x]) { return false; }
        keys[x] = true;
        return true;
    });

    return {
        key: wordEnglish,
        components: comps,
        exclusives: exclusives,
        conflict: 0
    };

}