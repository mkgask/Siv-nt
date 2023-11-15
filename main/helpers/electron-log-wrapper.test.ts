import { logLevel, electronLogLevel, deps_spaces, toString, convert } from './electron-log-wrapper';
import { ElectronLogWrapper } from './electron-log-wrapper';


describe('toString', () => {
    it('should return "undefined" for undefined', () => {
        expect(toString(undefined)).toEqual('undefined');
    });

    it('should return "null" for null', () => {
        expect(toString(null)).toEqual('null');
    });

    it('should return an empty string for an empty string', () => {
        expect(toString('')).toEqual('');
    });

    it('should return the string for an simple string', () => {
        expect(toString('hello')).toEqual('hello');
    });

    it('should return the string value surrounded by quotes when inValue is true', () => {
        expect(toString('hello', 0, true)).toEqual('"hello"');
    });

    it('should return the string value surrounded by quotes when deps is greater than 0', () => {
        expect(toString('hello', 1)).toEqual('    "hello"');
    });

    it('should handle special characters in strings', () => {
        const specialString = 'special!@#$%^&*()_+-=[]{}|;:",./<>?`~';
        expect(toString(specialString)).toEqual(`${specialString}`);
    });

    it('should return "[function name]" for named functions', () => {
        function namedFunction() { }
        expect(toString(namedFunction)).toEqual('[function namedFunction]');
    });

    it('should return "[anonymous function]" for anonymous functions', () => {
        expect(toString(function () { })).toEqual('[anonymous function]');
    });

    // Jestではアロー関数がラップされて匿名関数として取得されるのでテストできない
    //it('should return "[lambda function]" for lambda functions', () => {
    //    expect(toString(() => { })).toEqual('[lambda function]');
    //});
    it('should return "[anonymous function]" for anonymous functions', () => {
        expect(toString(() => { })).toEqual('[anonymous function]');
    });


    it('should return "[]" for an empty array', () => {
        expect(toString([])).toEqual('[]');
    });

    it('should return the string representation of an array', () => {
        expect(toString([1, 'two', { three: 3, for: "for" }, true])).toMatch(`[
    1,
    "two",
    {
        three: 3,
        for: "for",
    },
    true,
]`);
    });

    it('should return "{}" for an empty object', () => {
        expect(toString({})).toEqual('{}');
    });

    it('should return the string representation of an object', () => {
        expect(toString({ a: 1, b: 'two', c: { three: 3, for: "for" }, d: true })).toMatch(`{
    a: 1,
    b: "two",
    c: {
        three: 3,
        for: "for",
    },
    d: true,
}`);
    });

    it('should return the string representation of a number', () => {
        expect(toString(42)).toEqual('42');
    });

    it('should handle floating-point numbers', () => {
        expect(toString(3.14)).toEqual('3.14');
    });

    it('should handle negative numbers', () => {
        expect(toString(-42)).toEqual('-42');
    });

    it('should return the string representation of a boolean', () => {
        expect(toString(true)).toEqual('true');
    });

    it('should return the string representation of a symbol', () => {
        const sym = Symbol('test');
        expect(toString(sym)).toEqual(sym.toString());
    });

    it('should handle symbols with different descriptions', () => {
        const sym1 = Symbol('symbol1');
        const sym2 = Symbol('symbol2');
        expect(toString(sym1)).toEqual(sym1.toString());
        expect(toString(sym2)).toEqual(sym2.toString());
    });

    it('should return the string representation of a bigint', () => {
        const bigInt = BigInt(9007199254740991);
        expect(toString(bigInt)).toEqual(bigInt.toString());
    });


});



describe('electronLogLevel', () => {
    it('should return false for false', () => {
        expect(electronLogLevel(false)).toEqual(false);
    });

    it('should return "error" for logLevel.error', () => {
        expect(electronLogLevel(logLevel.error)).toEqual('error');
    });

    it('should return "warn" for logLevel.warn', () => {
        expect(electronLogLevel(logLevel.warn)).toEqual('warn');
    });

    it('should return "info" for logLevel.info', () => {
        expect(electronLogLevel(logLevel.info)).toEqual('info');
    });

    it('should return "verbose" for logLevel.verbose', () => {
        expect(electronLogLevel(logLevel.verbose)).toEqual('verbose');
    });

    it('should return "debug" for logLevel.debug', () => {
        expect(electronLogLevel(logLevel.debug)).toEqual('debug');
    });

    it('should return "silly" for logLevel.silly', () => {
        expect(electronLogLevel(logLevel.silly)).toEqual('silly');
    });

    // そもそも型で縛っているのでdefault:は実行できない
    //it('should return false for an unknown log level', () => {
    //    expect(electronLogLevel('unknown' as logOption)).toEqual(false);
    //});
});



describe('deps_spaces', () => {
    it('should return an empty string when deps is 0', () => {
        expect(deps_spaces(0)).toEqual('');
    });

    it('should return a string with the correct number of spaces when deps is positive', () => {
        expect(deps_spaces(1)).toEqual('    ');
    });

    it('should return a string with the correct number of spaces when deps is positive', () => {
        expect(deps_spaces(2)).toEqual('        ');
    });

    it('should return a string with the correct number of spaces when deps is positive', () => {
        expect(deps_spaces(3)).toEqual('            ');
    });

    it('should return an empty string when deps is negative', () => {
        expect(deps_spaces(-1)).toEqual('');
    });
});



describe('convert', () => {
  it('should return an empty string when given an empty array', () => {
    expect(convert('test', [])).toEqual('[test] ');
  });

  it('should handle normal string in strings', () => {
    expect(convert('test', ['test string'])).toEqual(`[test] test string`);
  });

  it('should handle special characters in strings', () => {
    const specialString = 'special!@#$%^&*()_+-=[]{}|;:",./<>?`~';
    expect(convert('test', [specialString])).toEqual(`[test] ${specialString}`);
  });

  it('should handle numbers', () => {
    expect(convert('test', [64])).toEqual('[test] 64');
  });

  it('should handle negative numbers', () => {
    expect(convert('test', [-42])).toEqual('[test] -42');
  });

  it('should handle floating-point numbers', () => {
    expect(convert('test', [3.14])).toEqual('[test] 3.14');
  });

  it('should return a string with the correct category and values', () => {
    expect(convert('test', [1, 'two', { three: 3, for: "for" }, true])).toEqual(`[test] 1 two {
    three: 3,
    for: "for",
}
 true`);
  });

  it('should handle symbols with different descriptions', () => {
    const sym1 = Symbol('symbol1');
    const sym2 = Symbol('symbol2');
    expect(convert('test', [sym1, sym2])).toEqual(`[test] ${sym1.toString()} ${sym2.toString()}`);
  });

  it('should handle bigints', () => {
    const bigInt = BigInt(9007199254740991);
    expect(convert('test', [bigInt])).toEqual(`[test] ${bigInt.toString()}`);
  });

  it('should handle functions', () => {
    function namedFunction() { }
    expect(convert('test', [namedFunction])).toEqual('[test] [function namedFunction]');
    expect(convert('test', [function () { }])).toEqual('[test] [anonymous function]');
    expect(convert('test', [() => { }])).toEqual('[test] [anonymous function]');
  });

  it('should handle undefined and null', () => {
    expect(convert('test', [undefined])).toEqual('[test] undefined');
    expect(convert('test', [null])).toEqual('[test] null');
  });

  it('should handle objects and arrays', () => {
    expect(convert('test', [{ a: 1, b: 'two', c: { three: 3, for: "for" }, d: true }])).toEqual(`[test] {
    a: 1,
    b: "two",
    c: {
        three: 3,
        for: "for",
    },
    d: true,
}
`);
    expect(convert('test', [[1, 'two', { three: 3, for: "for" }, true]])).toEqual(`[test] [
    1,
    "two",
    {
        three: 3,
        for: "for",
    },
    true,
]
`);
  });
});



jest.mock('electron-log', () => {
    return {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        silly: jest.fn(),
        log: jest.fn(),
        transports: {
            file: {
                fileName: 'testfilename.log',
                level: jest.fn(),
                getFile() {
                    return {
                        path: 'testpath',
                    };
                }
            },
        },
    };
});

import * as fs from 'fs';



describe('ElectronLogWrapper', () => {
  let logWrapper: ElectronLogWrapper = null;

  beforeEach(() => {
    logWrapper = new ElectronLogWrapper();
  });

  describe('start', () => {
    it('should set the log file name', () => {
      logWrapper.start();
      expect(logWrapper.getFileName()).toMatch(/20\d{6}-\w+-\w+\.log/);
    });
  });

  describe('level', () => {
    it('should set the log level', () => {
      logWrapper.level(2);
      expect(logWrapper.getLevel()).toEqual(2);
    });
  });

  describe('output', () => {
    it('should not output if the log level is false', () => {
      logWrapper.level(false);
      const spy = jest.spyOn(console, 'log');
      logWrapper.output('test', 1);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not output if the level parameter is false', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(console, 'log');
      logWrapper.output('test', false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not output if the log level is lower than the level parameter', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(console, 'log');
      logWrapper.output('test', 2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should output to the console with the correct log level', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(console, 'log');
      logWrapper.output('test', 1);
      expect(spy).toHaveBeenCalled();
    });

    it('should not output if the log level is upper than the level parameter', () => {
      logWrapper.level(2);
      const spy = jest.spyOn(console, 'log');
      logWrapper.output('test', 1);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should output an error message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.error('test', 'error message');
      expect(spy).toHaveBeenCalledWith('[test] "error message"', 0);
    });
  });

  describe('warn', () => {
    it('should output a warning message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.warn('test', 'warning message');
      expect(spy).toHaveBeenCalledWith('[test] "warning message"', 1);
    });
  });

  describe('info', () => {
    it('should output an info message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.info('test', 'info message');
      expect(spy).toHaveBeenCalledWith('[test] "info message"', 2);
    });
  });

  describe('verbose', () => {
    it('should output a verbose message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.verbose('test', 'verbose message');
      expect(spy).toHaveBeenCalledWith('[test] "verbose message"', 3);
    });
  });

  describe('debug', () => {
    it('should output a debug message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.debug('test', 'debug message');
      expect(spy).toHaveBeenCalledWith('[test] "debug message"', 4);
    });
  });

  describe('silly', () => {
    it('should output a silly message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.silly('test', 'silly message');
      expect(spy).toHaveBeenCalledWith('[test] "silly message"', 5);
    });
  });

  describe('log', () => {
    it('should output an info message', () => {
      logWrapper.level(1);
      const spy = jest.spyOn(logWrapper, 'output');
      logWrapper.log('test', 'log message');
      expect(spy).toHaveBeenCalledWith('[test] "log message"', 2);
    });
  });

  describe('isAllowedCategory', () => {
    it('should return true if category mode is false', () => {
      expect(logWrapper.isAllowedCategory('test')).toEqual(true);
    });

    it('should return true if the category is allowed', () => {
      logWrapper.categoryMode(true);
      logWrapper.allowCategories(['test']);
      expect(logWrapper.isAllowedCategory('test')).toEqual(true);
    });

    it('should return false if the category is not allowed', () => {
      logWrapper.categoryMode(true);
      logWrapper.allowCategories(['test']);
      expect(logWrapper.isAllowedCategory('other')).toEqual(false);
    });
  });

  describe('categoryMode', () => {
    it('should set the category mode', () => {
      logWrapper.categoryMode(true);
      expect(logWrapper.getCategoryMode()).toEqual(true);
    });
  });

  describe('allowCategories', () => {
    it('should add categories to the allowed categories list', () => {
      logWrapper.allowCategories(['test']);
      expect(logWrapper.getAllowedCategories()).toEqual(['test']);
    });
  });

  describe('clearCategories', () => {
    it('should clear the allowed categories list', () => {
      logWrapper.allowCategories(['test']);
      logWrapper.clearCategories();
      expect(logWrapper.getAllowedCategories()).toEqual([]);
    });
  });

  describe('removeLogFile', () => {
    it('should remove old log files', async () => {
      const readdirSync = jest.spyOn(fs, 'readdirSync');
      const spy_unlinkSync = jest.spyOn(fs, 'unlinkSync');
      await logWrapper.removeLogFile();
      expect(readdirSync).toHaveBeenCalled();
      expect(spy_unlinkSync).toHaveBeenCalled();
    });
  });
});