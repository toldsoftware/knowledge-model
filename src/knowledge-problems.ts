import { KnowledgeProblem, KnowledgeComponents } from './knowledge-state';


export function createRelationshipComponentName(a: string, b: string): string {

    if (b < a) {
        let c = a;
        a = b;
        b = c;
    }

    return a.replace(/~/g, '\\~') + '~' + b.replace(/~/g, '\\~');
}

export function createComponentsFromProblems(problems: KnowledgeProblem[]): KnowledgeComponents {
    let comps: KnowledgeComponents = {};

    for (let p of problems) {
        for (let c of p.components) {
            if (!comps[c]) {
                comps[c] = { name: c, occurences: 0 };
            }
        }
    }

    return comps;
}