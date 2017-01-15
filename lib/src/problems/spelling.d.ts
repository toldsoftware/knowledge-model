import { KnowledgeProblem } from './../knowledge-state';
export interface LetterSoundPair {
    letters: string;
    sound: string;
}
export declare function createSpellingProblem(wordPairs: LetterSoundPair[]): KnowledgeProblem;
