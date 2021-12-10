import { Commander } from './commander';

const program = new Commander();
program
  .options('-t --time', 'time', 60)
  .options('-l --log-level', 'logLevel', 1)
  .options('--times', 'times', 1);

export function run(cmd: string) {
  return program.run(cmd);
}
