import { KnowledgeDomain, KnowledgeState, KnowledgeComponent } from './knowledge-state';
import { calculateStats } from './stats';
import { forprops } from './utils';

export function calculateOccurences(domain: KnowledgeDomain) {
    if (domain.hasCalculatedOccurences) { return; }
    domain.hasCalculatedOccurences = true;
    for (let p of domain.problems) {
        for (let c of p.components) {
            if (!domain.components[c]) { domain.components[c] = { name: c, occurences: 0, exclusives: {}, conflict: 0 }; }
            domain.components[c].occurences++;
        }
    }
}

export function calculateConflict(domain: KnowledgeDomain, ) {
    if (domain.hasCalculatedConflict) { return; }
    domain.hasCalculatedConflict = true;

    calculateOccurences(domain);

    // for (let k in domain.components) {
    //     let c = domain.components[k];

    //     let totalUniquenessDeviationRatios = 0;
    //     let typeCount = 0;

    //     for (let exk in c.exclusives) {
    //         let ex = c.exclusives[exk];
    //         let occurences = [];
    //         for (let ok in ex) {
    //             let o = ex[ok];
    //             occurences.push(o.occurences);
    //         }

    //         if (occurences.length === 1) { continue; }

    //         let stats = calculateStats(occurences);
    //         totalUniquenessDeviationRatios += stats.stdDeviation / stats.range;
    //         typeCount++;
    //     }

    //     c.conflict = typeCount === 0 ? 0 : 1 - totalUniquenessDeviationRatios / typeCount;

    //     if (c.conflict <= 0 && typeCount > 0) {
    //         let breakdance = true;
    //     }
    // }

    for (let p of domain.problems) {
        let compInsideRatios: number[] = [];
        let ratiosDebug: { comp: KnowledgeComponent, ratio: number }[] = [];

        for (let c of p.components) {
            let comp = domain.components[c];
            forprops(comp.exclusives, x => {
                let othersInProblem: KnowledgeComponent[] = [];
                let othersNotInProblem: KnowledgeComponent[] = [];
                forprops(x, o => {
                    let isInProblem = p.components.indexOf(o.name) >= 0;
                    if (isInProblem) { othersInProblem.push(o); }
                    else { othersNotInProblem.push(o); }
                });

                let inProblemOccurences = othersInProblem.reduce((out, o) => out += o.occurences, 0);
                let outProblemOccurences = othersNotInProblem.reduce((out, o) => out += o.occurences, 0);

                if (othersInProblem.length > 1) {
                    let minInProblemOccurences = othersInProblem.reduce((out, o) => out < o.occurences ? out : o.occurences, 1000000000);
                    compInsideRatios.push(Math.pow(minInProblemOccurences / (inProblemOccurences + outProblemOccurences), othersInProblem.length));
                } else {
                    compInsideRatios.push(inProblemOccurences / (inProblemOccurences + outProblemOccurences));
                }

                ratiosDebug.push({ comp: comp, exclusive: x, ratio: compInsideRatios[compInsideRatios.length - 1] } as any);
            });
        }

        p.conflict = -Math.log(compInsideRatios.reduce((out, r) => out *= r, 1));
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
        let missingCount = 0;
        for (let c of p.components) {
            let cState = state[c];
            let cScore = 0;
            if (cState) {
                cScore = state[c].score;
            } else {
                missingCount++;
            }

            // Add Difficulty for rare items
            let occurenceRatio = domain.components[c].occurences / domain.problems.length;
            inverseScores += (1 - cScore) * (10 / (occurenceRatio + 1));
        }

        p.userDifficulty = (0.0001 + inverseScores) * Math.log(Math.E + p.components.length) * (1 + missingCount);
    }
}

export function calculateTiming(domain: KnowledgeDomain, state: KnowledgeState, nextMasterProblemNumber: number) {
    calculateOccurences(domain);

    for (let p of domain.problems) {
        let maxDist = 0;
        let totalDist = 0;
        let count = 0;
        for (let c of p.components) {
            let cState = state[c];
            let lastCorrect = 0;
            let lastWrong = 0;
            if (cState) {
                lastCorrect = cState.lastRightProblemNumber;
                lastWrong = cState.lastWrongProblemNumber;
            }

            let dist = nextMasterProblemNumber - lastCorrect;
            maxDist = Math.max(maxDist, dist);
            totalDist += dist;
            count++;
        }

        let aveDist = totalDist / count;

        p.userProblemsUntilRepeat = 100 / (1 + aveDist);
    }
}

export function calculatePriority(domain: KnowledgeDomain, state: KnowledgeState, nextMasterProblemNumber: number) {
    calculateValue(domain, state);
    calculateDifficulty(domain, state);
    calculateConflict(domain);
    calculateTiming(domain, state, nextMasterProblemNumber);

    for (let p of domain.problems) {
        p.userPriority = p.userDifficulty === 0 ? 0 : Math.log(1 + (p.userValue / Math.pow(p.userProblemsUntilRepeat, 2) / Math.pow((1 + p.userDifficulty), 1) / (0.01 + p.conflict)));
    }
}

