export interface KnowledgeState {
    [component: string]: KnowledgeScore;
}
export interface KnowledgeScore {
    right: number;
    wrong: number;
    score: number;
}
export interface KnowledgeComponent {
    name: string;
    occurences: number;
}
export interface KnowledgeComponents {
    [name: string]: KnowledgeComponent;
}
export interface KnowledgeProblem {
    key: string;
    components: string[];
    userValue?: number;
    userDifficulty?: number;
    userPriority?: number;
}
export interface KnowledgeDomain {
    problems: KnowledgeProblem[];
    components: KnowledgeComponents;
}
