import { Injectable } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class AppService {

  async simulateDeviceCommunication(): Promise<void> {
    return new Promise((resolve, reject) => {
      const isSuccess = Math.random() > 0.5;
      setTimeout(() => {
        if (isSuccess) {
          console.log('Device communication successful');
          resolve();
        } else {
          reject(new Error('Device not responding'));
        }
      }, 100);
    });
  }

  async triggerDevice(): Promise<string> {
    const circuitBreaker = new CircuitBreaker(this.simulateDeviceCommunication, {
        failureThreshold: 3,
        successThreshold: 1,
        timeout: 5000,
        maxHalfOpenAttempts: 3,
        onStateChange: (state) =>
          console.log(`⚙️ Circuit Breaker state changed to: ${state}`),
        onFailure: (err) => console.error(`Failure: ${err.message}`),
        onSuccess: () => console.log('Communication succeeded'),
    });

    for (let i = 0; i < 15; i++) {
      try {
        await circuitBreaker.fire();
      } catch (err) {
        console.error((err as Error).message);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return 'Hello World!';
  }
}
