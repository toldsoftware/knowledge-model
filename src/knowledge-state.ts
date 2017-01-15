
export interface KnowledgeState {

    // Entity Component: 
    // 'cat', 'letter_c', 'sound_K'
    // Relationship Component: A~B (Alphabetic Order)
    // 'cat~letter_c', 'letter_c~sound_K'
    // Search for '^|~cat$|~' to find all relationships
    // Task Component:
    // '(hear)', '(spell)', '(type)'
    [component: string]: KnowledgeScore;
}

export interface KnowledgeScore {
    right: number;
    wrong: number;

    // Score is normally a running average of past 5 
    // (i.e. score = 0.8 * score + 0.2 * isRight)
    score: number;
}

export interface KnowledgeComponent {
    name: string;
    occurences: number;
    exclusives: {
        [type: string]: { [keys: string]: KnowledgeComponent }
    };
    conflict: number;
}

export interface KnowledgeComponents {
    [name: string]: KnowledgeComponent;
}

export interface KnowledgeProblem {
    key: string;
    components: string[];
    exclusives: { type: string, items: string[] }[];
    conflict: number;
    userValue?: number;
    userDifficulty?: number;
    userPriority?: number;
}

export interface KnowledgeDomain {
    problems: KnowledgeProblem[];
    components: KnowledgeComponents;
    hasCalculatedOccurences?: boolean;
    hasCalculatedConflict?: boolean;
}