export function calculateStandardDeviation(items: number[]): number {
    let count = items.length;
    let total = items.reduce((out, x) => out += x);
    let ave = total / count;
    let errSumOfSquares = items.reduce((out, x) => out += (ave - x) * (ave - x));
    let variance = errSumOfSquares / (count - 1);
    let stdDeviation = Math.sqrt(variance);

    return stdDeviation;
}

export function calculateStats(items: number[]) {
    let count = items.length;
    let total = items.reduce((out, x) => out += x);
    let ave = total / count;
    let min = items.reduce((out, x) => out < x ? out : x);
    let max = items.reduce((out, x) => out > x ? out : x);
    let errSumOfSquares = items.reduce((out, x) => out += (ave - x) * (ave - x), 0);
    let variance = errSumOfSquares / (count - 1);
    let stdDeviation = Math.sqrt(variance);

    return { stdDeviation, total, ave, min, max, range: max - min };
}

(window as any)['__calculateStats'] = calculateStats;