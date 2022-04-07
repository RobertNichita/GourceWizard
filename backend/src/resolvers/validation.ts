import {UserInputError} from 'apollo-server-core';
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
  constructor(begin = -Infinity, end = Infinity) {
    this.begin = begin;
    this.end = end;
  }

  validate(data: number): string | undefined {
    if (data !== 0 && !data) {
      return 'data must be a valid number';
    }
    return this.begin <= data && data <= this.end
      ? undefined
      : `${data} is not between defined limits [${this.begin}-${this.end}]`;
  }
}

export function validateArgs(
  args: any,
  rules: {[arg: string]: {rule: ValidationRule<any>}}
): void {
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

  if (errors && Object.keys(errors).length > 0) {
    throw new UserInputError(`${JSON.stringify(errors)}`);
  }
}

export const githubUrlPattern =
  /^https:\/\/github\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\.git$/;

//https://stackoverflow.com/questions/20988446/regex-for-mongodb-objectid
export const mongoObjectIdPattern = /^[a-f\d]{24}$/i;

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
