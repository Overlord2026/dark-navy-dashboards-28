import type { MonteCarloParams, MonteCarloResult, SimulationProgress } from './types';

export class MonteCarloWorker {
  private worker: Worker | null = null;
  private isRunning = false;

  async runSimulation(
    params: MonteCarloParams,
    onProgress?: (progress: SimulationProgress) => void
  ): Promise<MonteCarloResult> {
    if (this.isRunning) {
      throw new Error('Simulation already running');
    }

    this.isRunning = true;

    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker('/montecarlo-worker.js');

        this.worker.onmessage = (e) => {
          const { type, result, error, completed, total, percentage } = e.data;

          if (type === 'progress') {
            onProgress?.({ completed, total, percentage });
          } else if (type === 'result') {
            this.cleanup();
            resolve(result);
          } else if (type === 'error') {
            this.cleanup();
            reject(new Error(error));
          }
        };

        this.worker.onerror = (error) => {
          this.cleanup();
          reject(error);
        };

        // Start simulation
        this.worker.postMessage({
          type: 'run-simulation',
          params
        });
      } catch (error) {
        this.cleanup();
        reject(error);
      }
    });
  }

  terminate() {
    this.cleanup();
  }

  private cleanup() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isRunning = false;
  }

  get running() {
    return this.isRunning;
  }
}