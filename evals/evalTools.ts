import 'dotenv/config';
import type { Score, Scorer } from 'autoevals';
import chalk from 'chalk';
import { JSONFilePreset } from 'lowdb/node';

type Run = {
    input: any;
    output: any;
    expected: any;
    scores: {
        name: Score['name'];
        score: Score['score'];
    }[];
    createdAt?: string;
};

type Set = {
    runs: Run[];
    score: number;
    createdAt: string;
};

type Experiment = {
    name: string;
    sets: Set[];
};

type Data = {
    experiments: Experiment[];
};

const defaultData: Data = { experiments: [] };

const getDb = async () => JSONFilePreset<Data>('results.json', defaultData);

const calculateAvgScore = (runs: Run[]): number => {
    if (runs.length === 0) return 0;

    const totalScores = runs.reduce((sum, run) => {
        const runAvg =
            run.scores.reduce((sum, score) => sum + score.score, 0) / run.scores.length;
        return sum + runAvg;
    }, 0);

    return totalScores / runs.length;
};

export const loadExperiment = async (experimentName: string): Promise<Experiment | undefined> => {
    const db = await getDb();
    return db.data.experiments.find((e) => e.name === experimentName);
};

export const saveSet = async (experimentName: string, runs: Omit<Run, 'createdAt'>[]) => {
    const db = await getDb();
    const timestamp = new Date().toISOString();

    const runsWithTimestamp = runs.map((run) => ({ ...run, createdAt: timestamp }));
    const newSet: Set = {
        runs: runsWithTimestamp,
        score: calculateAvgScore(runsWithTimestamp),
        createdAt: timestamp,
    };

    const existingExperiment = db.data.experiments.find((e) => e.name === experimentName);
    if (existingExperiment) {
        existingExperiment.sets.push(newSet);
    } else {
        db.data.experiments.push({ name: experimentName, sets: [newSet] });
    }

    await db.write();
};

export const runEval = async <T = any>(
    experimentName: string,
    {
        task,
        data,
        scorers,
    }: {
        task: (input: any) => Promise<T>;
        data: { input: any; expected?: T; reference?: string | string[] }[];
        scorers: Scorer<T, any>[];
    }
) => {
    const results = await Promise.all(
        data.map(async ({ input, expected, reference }) => {
            const taskResult = await task(input);
            // Ensure taskResult is an object before attempting property access
            const output = typeof taskResult === 'object' && taskResult !== null && 'response' in taskResult 
                ? (taskResult as { response: string }).response 
                : taskResult;

            const context = typeof taskResult === 'object' && taskResult !== null && 'context' in taskResult 
                ? (taskResult as { context: string | string[] }).context 
                : undefined;

            const scores = await Promise.all(
                scorers.map(async (scorer) => {
                    const score = await scorer({ input, output, expected, reference, context });
                    return { name: score.name, score: score.score };
                })
            );

            return { input, output, expected, scores };
        })
    );

    const previousExperiment = await loadExperiment(experimentName);
    const previousScore = previousExperiment?.sets.at(-1)?.score ?? 0;
    const currentScore = calculateAvgScore(results);
    const scoreDiff = currentScore - previousScore;

    const color = !previousExperiment
        ? chalk.blue
        : scoreDiff > 0
        ? chalk.green
        : scoreDiff < 0
        ? chalk.red
        : chalk.blue;

    console.log(`Experiment: ${experimentName}`);
    console.log(`Previous score: ${color(previousScore.toFixed(2))}`);
    console.log(`Current score: ${color(currentScore.toFixed(2))}`);
    console.log(`Difference: ${scoreDiff > 0 ? '+' : ''}${color(scoreDiff.toFixed(2))}\n`);

    await saveSet(experimentName, results);

    return results;
};

