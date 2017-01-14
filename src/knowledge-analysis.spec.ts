import { KnowledgeDomain, calculatePriority, createComponentsFromProblems } from './';
import { createSpellingProblem } from './problems/spelling';


function createDomain() {

    let domain: KnowledgeDomain = {
        components: {},
        problems: []
    };

    domain.problems.push(createSpellingProblem([
        { letters: 'b', sound: 'B' },
        { letters: 'a', sound: 'A' },
        { letters: 't', sound: 'T' }
    ]).problem);

    domain.problems.push(createSpellingProblem([
        { letters: 'b', sound: 'B' },
        { letters: 'a', sound: 'A' },
        { letters: 'd', sound: 'D' }
    ]).problem);

    domain.problems.push(createSpellingProblem([
        { letters: 'c', sound: 'K' },
        { letters: 'a', sound: 'A' },
        { letters: 't', sound: 'T' }
    ]).problem);

    domain.problems.push(createSpellingProblem([
        { letters: 't', sound: 'T' },
        { letters: 'a', sound: 'A' },
        { letters: 'ck', sound: 'K' }
    ]).problem);

    domain.problems.push(createSpellingProblem([
        { letters: 'd', sound: 'D' },
        { letters: 'o', sound: 'O' },
        { letters: 'g', sound: 'G' }
    ]).problem);

    domain.components = createComponentsFromProblems(domain.problems);

    return domain;
}

function logProblems(d: KnowledgeDomain) {
    let p = d.problems.map(x => x);
    p.sort((a, b) => b.userPriority - a.userPriority);
    // console.log(p.map(x => (`${x.key} ${x.userPriority}=${x.userValue}/${x.userDifficulty}`)));
    console.log('Problems:');
    p.forEach(x => console.log((`${x.key} ${Math.round(x.userPriority * 100) / 100} = ${Math.round(x.userValue * 100) / 100} / ${Math.round(x.userDifficulty * 100) / 100}`)));
}

describe('calculatePriority', () => {
    let domain = createDomain();
    calculatePriority(domain, {});
    logProblems(domain);

    it('should calculate occurence for all components', () => {
        for (let k in domain.components) {
            expect(domain.components[k].occurences).toBeGreaterThanOrEqual(1);
        }
    });

    it('should calculate difficulty for all problems', () => {
        domain.problems.forEach(x => expect(x.userDifficulty).toBeGreaterThan(1));
    });

    it('should calculate value for all problems', () => {
        domain.problems.forEach(x => expect(x.userValue).toBeGreaterThan(1));
    });

    it('should prioritize all problems', () => {
        domain.problems.forEach(x => expect(x.userPriority).toBeGreaterThanOrEqual(0));
    });
});

describe('calculatePriority with problem knowledge', () => {
    let domain = createDomain();
    let pComponents = domain.problems[0].components;
    let pState = {} as any;
    pComponents.forEach(x => {
        pState[x] = { right: 1, wrong: 0, score: 1 };
    });
    calculatePriority(domain, pState);

    logProblems(domain);

    it('should make problem no value', () => {
        expect(domain.problems[0].userValue).toEqual(0);
    });

    it('should make problem no difficulty', () => {
        expect(domain.problems[0].userDifficulty).toEqual(0);
    });

    it('should make problem no priority', () => {
        expect(domain.problems[0].userPriority).toEqual(0);
    });
});

describe('calculatePriority with 2 problem knowledge', () => {
    let domain = createDomain();
    let pComponents = [...domain.problems[0].components, ...domain.problems[1].components];
    let pState = {} as any;
    pComponents.forEach(x => {
        pState[x] = { right: 1, wrong: 0, score: 1 };
    });
    calculatePriority(domain, pState);

    logProblems(domain);

    it('should make both no value', () => {
        expect(domain.problems[0].userValue).toEqual(0);
        expect(domain.problems[1].userValue).toEqual(0);
    });

    it('should make both no difficulty', () => {
        expect(domain.problems[0].userDifficulty).toEqual(0);
        expect(domain.problems[1].userDifficulty).toEqual(0);
    });

    it('should make both no priority', () => {
        expect(domain.problems[0].userPriority).toEqual(0);
        expect(domain.problems[1].userPriority).toEqual(0);
    });
});