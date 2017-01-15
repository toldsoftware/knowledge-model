import { KnowledgeProblem, KnowledgeComponents } from './knowledge-state';
import { calculateConflict } from './knowledge-analysis';


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
                comps[c] = { name: c, occurences: 0, exclusives: {}, conflict: 0 };
            }
        }

        for (let exclusive of p.exclusives) {

            let exc = {} as any;
            for (let item of exclusive.items) {
                if (exc[item]) { continue; }
                exc[item] = true;
                comps[item].exclusives[exclusive.type] = comps[item].exclusives[exclusive.type] || {};
                exclusive.items.filter(x => x !== item).forEach(x => comps[item].exclusives[exclusive.type][x] = comps[x]);
            }
        }
    }

    return comps;
}