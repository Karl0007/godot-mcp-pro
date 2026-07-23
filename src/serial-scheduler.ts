export class SerialScheduler {
  private tail: Promise<void> = Promise.resolve();

  enqueue<T>(operation: () => T | PromiseLike<T>): Promise<T> {
    const result = this.tail.then(operation, operation);
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}
