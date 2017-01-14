import { KnowledgeProblem } from './../knowledge-state';
export interface LetterSoundPair {
    letter: string;
    sound: string;
}
export declare function createSpellingProblem(word: LetterSoundPair[]): {
    problem: KnowledgeProblem;
    componentNames: string[];
};
