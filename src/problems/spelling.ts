import { KnowledgeProblem, KnowledgeComponent } from './../knowledge-state';
import { createRelationshipComponentName } from './../knowledge-problems';

export interface LetterSoundPair {
    letters: string;
    sound: string;
}

export function createSpellingProblem(word: LetterSoundPair[]): { problem: KnowledgeProblem, componentNames: string[] } {

    let comps: string[] = [];

    let key = word.map(x => x.letters).join('');
    for (let x of word) {

        let letters = 'l:' + x.letters;
        let sound = 's:' + x.sound;

        comps.push(letters);
        comps.push(sound);
        comps.push(createRelationshipComponentName(letters, sound));
        comps.push(createRelationshipComponentName(letters, key));
        comps.push(createRelationshipComponentName(sound, key));

        comps.push(createRelationshipComponentName(sound, '(hear)'));
        x.letters.split('').forEach(c => comps.push(createRelationshipComponentName('l:' + c, '(type)')));
        if (x.letters.length > 0) { x.letters.split('').forEach(c => comps.push(createRelationshipComponentName('l:' + c, '(read)'))); }
        comps.push(createRelationshipComponentName(letters, '(read)'));
    }

    let keys = {} as any;
    comps = comps.filter(x => {
        if (keys[x]) { return false; }
        keys[x] = true;
        return true;
    });

    return {
        problem: { key: key, components: comps },
        componentNames: comps
    };

}