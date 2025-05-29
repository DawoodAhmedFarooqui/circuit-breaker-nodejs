type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
  maxHalfOpenAttempts?: number;
  onStateChange?: (newState: CircuitState) => void;
  onFailure?: (error: Error) => void;
  onSuccess?: () => void;
}

export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private halfOpenAttempts = 0;
  private state: CircuitState = 'CLOSED';

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly timeout: number;
  private readonly maxHalfOpenAttempts: number;
  private readonly onStateChange?: (newState: CircuitState) => void;
  private readonly onFailure?: (error: Error) => void;
  private readonly onSuccess?: () => void;

  constructor(
    private readonly deviceCommunication: () => Promise<void>,
    options: CircuitBreakerOptions = {},
  ) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.successThreshold = options.successThreshold ?? 1;
    this.timeout = options.timeout ?? 5000;
    this.maxHalfOpenAttempts = options.maxHalfOpenAttempts ?? 5;
    this.onStateChange = options.onStateChange;
    this.onFailure = options.onFailure;
    this.onSuccess = options.onSuccess;
  }

  public async fire(): Promise<void> {
    const now = Date.now();

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.timeout) {
        this.transitionTo('HALF_OPEN');
      } else {
        throw new Error(
          'Circuit Breaker is OPEN. Calls are temporarily blocked.',
        );
      }
    }

    try {
      await this.deviceCommunication();

      this.onSuccess?.();

      if (this.state === 'HALF_OPEN') {
        this.successCount++;
        if (this.successCount >= this.successThreshold) {
          this.transitionTo('CLOSED');
        }
      } else {
        this.reset();
      }
    } catch (error) {
      this.onFailure?.(error as Error);

      if (this.state === 'HALF_OPEN') {
        this.halfOpenAttempts++;
        if (this.halfOpenAttempts >= this.maxHalfOpenAttempts) {
          this.transitionTo('OPEN');
        }
      } else {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
          this.transitionTo('OPEN');
        }
      }

      throw error;
    }
  }

  private transitionTo(newState: CircuitState): void {
    this.state = newState;
    this.onStateChange?.(newState);
    this.resetMetrics();

    if (newState === 'OPEN') {
      this.lastFailureTime = Date.now();
    }
  }

  private resetMetrics(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenAttempts = 0;
  }

  private reset(): void {
    this.resetMetrics();
    this.transitionTo('CLOSED');
  }

  // 🔍 Getters for Monitoring
  public getState(): CircuitState {
    return this.state;
  }

  public getFailureCount(): number {
    return this.failureCount;
  }

  public getSuccessCount(): number {
    return this.successCount;
  }

  public getLastFailureTime(): number {
    return this.lastFailureTime;
  }
}
