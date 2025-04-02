
// This file adds TypeScript declarations for Jest functions and global variables

declare global {
  const jest: {
    fn: <T = any>() => jest.Mock<T>;
    mock: (path: string, factory?: any) => any;
    clearAllMocks: () => void;
    resetAllMocks: () => void;
    restoreAllMocks: () => void;
    spyOn: <T extends {}, M extends keyof T>(object: T, method: M) => jest.SpyInstance<T[M]>;
  };

  namespace jest {
    interface Mock<T = any> {
      new (...args: any[]): T;
      (...args: any[]): any;
      mockImplementation: (fn: (...args: any[]) => any) => Mock<T>;
      mockImplementationOnce: (fn: (...args: any[]) => any) => Mock<T>;
      mockReturnValue: (value: any) => Mock<T>;
      mockReturnValueOnce: (value: any) => Mock<T>;
      mockResolvedValue: (value: any) => Mock<T>;
      mockResolvedValueOnce: (value: any) => Mock<T>;
      mockRejectedValue: (value: any) => Mock<T>;
      mockRejectedValueOnce: (value: any) => Mock<T>;
      mockClear: () => Mock<T>;
      mockReset: () => Mock<T>;
    }

    interface SpyInstance<T> extends Mock<T> {
      mockRestore: () => void;
    }
  }

  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  function beforeAll(fn: () => void): void;
  function afterAll(fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  const expect: (value: any) => any;
}

export {};
