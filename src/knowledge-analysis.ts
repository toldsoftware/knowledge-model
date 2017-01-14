import { KnowledgeDomain, KnowledgeState } from './knowledge-state';

export function calculateOccurences(domain: KnowledgeDomain) {

    for (let p of domain.problems) {
        for (let c of p.components) {
            if (!domain.components[c]) { domain.components[c] = { name: c, occurences: 0 }; }
            domain.components[c].occurences++;
        }
    }
}

export function calculateValue(domain: KnowledgeDomain, state: KnowledgeState) {
    calculateOccurences(domain);

    for (let p of domain.problems) {
        let value = 0;
        for (let c of p.components) {
            let cScore = !state[c] ? 0 : state[c].score;
            value += (1 - cScore) * Math.log(Math.E + domain.components[c].occurences);
        }
        p.userValue = value;
    }
}

export function calculateDifficulty(domain: KnowledgeDomain, state: KnowledgeState) {
    calculateOccurences(domain);

    for (let p of domain.problems) {
        let inverseScores = 0;
        for (let c of p.components) {
            let cState = state[c];
            let cScore = 0;
            if (cState) {
                cScore = state[c].score;
            }

            // Add Difficulty for rare items
            let occurenceRatio = domain.components[c].occurences / domain.problems.length;

            inverseScores += (1 - cScore) * (10 / (occurenceRatio + 1));
        }
        p.userDifficulty = inverseScores * Math.log(Math.E + p.components.length);
    }
}

export function calculatePriority(domain: KnowledgeDomain, state: KnowledgeState) {
    calculateValue(domain, state);
    calculateDifficulty(domain, state);

    for (let p of domain.problems) {
        p.userPriority = p.userDifficulty === 0 ? 0 : p.userValue / p.userDifficulty;
    }
}