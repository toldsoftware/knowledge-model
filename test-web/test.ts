import { KnowledgeDomain, KnowledgeState, calculatePriority, createComponentsFromProblems } from './../src/';
import { createSpellingProblem } from './../src/problems/spelling';
import { Ajax } from './ajax';
import { loadUnixode } from './unixode-loader';

let domain: KnowledgeDomain = null;
let state: KnowledgeState = null;
let host: HTMLDivElement = null;

(window as any)['__debug'] = () => ({
    domain, state, host,
    getProblems: (key: string) => {
        return domain.problems.filter(x => x.key.toUpperCase() === key.toUpperCase())
            .map(x => ({ ...x, componentsObjects: x.components.map(c => domain.components[c]) }));
    }
});

function setup() {
    let input = document.createElement('input') as HTMLInputElement;
    document.body.appendChild(input);
    input.type = 'text';
    input.onchange = () => addProblem(input.value);

    host = document.createElement('div');
    document.body.appendChild(host);

    let ajax = new Ajax();
    ajax.get('/Words_UniXode_Kids.txt', r => {
        setTimeout(() => {
            // ajax.get('/Words_UniXode.txt', r => {
            let result = loadUnixode(r);
            let words = result.words.map(x => x.pairs.map(x2 => ({ letters: x2.english, sound: x2.xharish })));
            let problems = words.map(x => createSpellingProblem(x));
            let comps = createComponentsFromProblems(problems);

            // let excComps = [] as any;
            // for (let k in comps) {
            //     if (Object.getOwnPropertyNames(comps[k].exclusives).length === 0) { continue; }
            //     excComps.push(comps[k]);
            // }
            // console.log(excComps);

            console.log(problems.filter(x => x.conflict > 0));

            domain = { components: comps, problems: problems, hasCalculatedConflict: false, hasCalculatedOccurences: false };
            state = {};
            showPriority();
        });
    }, err => console.warn(err));
}

function showPriority() {
    calculatePriority(domain, state);

    let html = '';
    let p = domain.problems.map(x => x);
    p.sort((a, b) => b.userPriority - a.userPriority);
    p.forEach(x => html += '<br>' + (`${x.key} ${Math.round(x.userPriority * 100) / 100} = ${Math.round(x.userValue * 100) / 100} / ${Math.round(x.userDifficulty * 100) / 100} / ${Math.round(x.conflict * 100) / 100}`));
    host.innerHTML = html;
}

function addProblem(key: string) {
    console.log('addProblem', key, state);
    key = key.toUpperCase();

    let p = domain.problems.filter(x => x.key === key);
    p.sort((a, b) => b.userPriority - a.userPriority);

    if (p[0]) {
        p[0].components.forEach(x => {
            let c = domain.components[x];
            let s = state[x];
            if (!s) { s = state[x] = { right: 0, wrong: 0, score: 0 }; }
            s.right++;
            s.score = s.score * 0.5 + 0.5;
            if (s.score >= 0.75 && s.wrong === 0) { s.score = 1; }
        });
    }

    showPriority();
}

setup();