import {log} from '../logger';

export interface ValidationRule<T> {
  validate(data: T): string | undefined;
}

export class MatcherRule implements ValidationRule<string> {
  pattern: RegExp;
  constructor(pattern: RegExp) {
    this.pattern = pattern;
  }
  validate(data: string): string | undefined {
    if (!this.pattern.test(data)) {
      return `${JSON.stringify(data)} failed to validate`;
    }
    return undefined;
  }
}

export class RangeRule implements ValidationRule<number> {
  begin: number;
  end: number;
  constructor(begin: number, end: number) {
    this.begin = begin;
    this.end = end;
  }

  validate(data: number): string | undefined {
    return this.begin <= data && data <= this.end
      ? undefined
      : `${data} is not between defined limits [${this.begin}-${this.end}]`;
  }
}

export function validateArgs(
  args: any,
  rules: {[arg: string]: {rule: ValidationRule<any>}}
): {[arg: string]: {error: string}} {
  log(JSON.stringify(args));
  const errors: {[arg: string]: {error: string}} = {};

  for (const [name, arg] of Object.entries(args)) {
    const ruleObj = rules[name];
    if (!ruleObj) {
      continue;
    }

    const error: string | undefined = ruleObj.rule.validate(arg);
    if (error) {
      log(
        `Failed to validate | Name: ${name}, Arg:${JSON.stringify(
          arg
        )}, rule:${JSON.stringify(error)}`
      );
      errors[name] = {error: error};
    }
  }
  return errors;
}

const githubUrlPattern =
  /^https:\/\/github\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\.git$/;

export const renderOptionsRules = (stop: Number | undefined) => {
  return {
    start: {rule: new RangeRule(0.0, stop! as number)},
    stop: {rule: new RangeRule(0.0, 1.0)},
    elasticity: {rule: new RangeRule(0.0, 3.0)},
    bloomMultiplier: {rule: new RangeRule(0.0, 1.5)},
    bloomIntensity: {rule: new RangeRule(0.0, 1.5)},
  };
};

export const renderRules = {
  repoURL: {
    rule: new MatcherRule(githubUrlPattern),
  },
};
