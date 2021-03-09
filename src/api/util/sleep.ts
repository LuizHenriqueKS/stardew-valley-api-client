import { resolve } from 'path';

function sleep(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}

export default sleep;
