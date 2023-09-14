/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

/* eslint-disable @typescript-eslint/no-unsafe-argument */
export function messageBlock(title: string, msg: string, char = "-", width = 80): string {
  const titleBar = char.repeat(
    Math.max(0, Math.floor((width - title.length - 2) / 2 / char.length))
  );
  const bottomBar = char.repeat(Math.floor(width / char.length));

  return `\n${titleBar} ${title} ${titleBar}\n${msg}\n${bottomBar}`;
}

/**
 * Check whether ctor (usually a class) implements T. Compiler throws
 * error if not
 * @param ctor The class to check
 * @example
 * ```typescript
 * interface XConstructor {
 *   staticMethod(): number;
 * }
 * class BadX {
 *   staticMethod() { return "123"; }
 * }
 * // compiler ERROR: it fails to convert BadX to XConstructor
 * staticImplements<XConstructor>(BadX);
 * ```
 */
export function staticImplements<T>(ctor: T) {} //eslint-disable-line

export function isObjectEmpty(o: object): boolean {
  return Object.keys(o).length === 0;
}

export const voidFunc = () => {
  return;
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface IDeferred<T> {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  promise: () => Promise<T>;
}

/**
 * Mimic jQuery defer or Angual $q.defer.
 *
 * @example
 * ```typescript
 * function numberPromise(): Promise<number> {
 *   const d = defer<number>();
 *   setTimeout(() => {
 *     d.resolve(100);
 *   }, 100);
 *   return d.promise();
 * }
 *
 * async function test() {
 *   console.log(await numberPromise());  // should print 5
 * }
 * ```
 * @returns A deferred object
 */
export function defer<T>(): IDeferred<T> {
  let res: (value: T | PromiseLike<T>) => void = voidFunc,
    rej: (reason?: any) => void = voidFunc;
  const promise = new Promise<T>((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  return {
    resolve: res,
    reject: rej,
    promise: () => promise,
  };
}

let _isLog = true;

export const log = {
  on: () => {
    _isLog = true;
  },
  off: () => {
    _isLog = false;
  },
  info: (...args: any[]) => {
    if (_isLog) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (_isLog) {
      console.warn(...args);
    }
  },
  errMsgNCuz: (err: any) => {
    if (_isLog) {
      console.log(String((err as Error).message) + " - " + String((err as Error).cause));
    }
  },

  error: console.error,
  assert: console.assert,
};
