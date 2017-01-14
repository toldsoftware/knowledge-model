import { KnowledgeProblem } from './../knowledge-state';
export interface LetterSoundPair {
    letters: string;
    sound: string;
}
export declare function createSpellingProblem(word: LetterSoundPair[]): {
    problem: KnowledgeProblem;
    componentNames: string[];
};
