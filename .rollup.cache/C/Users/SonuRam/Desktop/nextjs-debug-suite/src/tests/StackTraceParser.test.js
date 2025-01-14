import { StackTraceParser } from '../core/errorDNA/stackTraceParser';
describe('StackTraceParser', function () {
    var parser;
    beforeEach(function () {
        parser = new StackTraceParser();
    });
    it('should parse a Chrome stack trace', function () {
        var stackTrace = "\n      at Component (webpack://my-app/src/components/Component.tsx:10:15)\n      at renderWithHooks (webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js:14985:18)\n      at mountIndeterminateComponent (webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js:17811:13)\n    ";
        var frames = parser.parse(stackTrace);
        expect(frames).toEqual([
            {
                fileName: 'my-app/src/components/Component.tsx',
                lineNumber: 10,
                columnNumber: 15,
                functionName: 'Component',
                source: 'webpack://my-app/src/components/Component.tsx'
            },
            {
                fileName: 'my-app/node_modules/react-dom/cjs/react-dom.development.js',
                lineNumber: 14985,
                columnNumber: 18,
                functionName: 'renderWithHooks',
                source: 'webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js'
            },
            {
                fileName: 'my-app/node_modules/react-dom/cjs/react-dom.development.js',
                lineNumber: 17811,
                columnNumber: 13,
                functionName: 'mountIndeterminateComponent',
                source: 'webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js'
            }
        ]);
    });
    it('should parse a Firefox stack trace', function () {
        var stackTrace = "\n      TestError@http://localhost:3000/static/js/bundle.js:1234:5\n      Component@http://localhost:3000/static/js/main.chunk.js:567:8\n      dispatchEvent@http://localhost:3000/static/js/vendor.chunk.js:89:10\n    ";
        var frames = parser.parse(stackTrace);
        expect(frames).toEqual([
            {
                fileName: 'static/js/bundle.js',
                lineNumber: 1234,
                columnNumber: 5,
                functionName: 'TestError',
                source: 'http://localhost:3000/static/js/bundle.js'
            },
            {
                fileName: 'static/js/main.chunk.js',
                lineNumber: 567,
                columnNumber: 8,
                functionName: 'Component',
                source: 'http://localhost:3000/static/js/main.chunk.js'
            },
            {
                fileName: 'static/js/vendor.chunk.js',
                lineNumber: 89,
                columnNumber: 10,
                functionName: 'dispatchEvent',
                source: 'http://localhost:3000/static/js/vendor.chunk.js'
            }
        ]);
    });
    it('should normalize file names', function () {
        var stackTrace = "\n      at Component (webpack://my-app/./src/components/Component.tsx:10:15)\n      at handleError (C:/Users/test/project/src/handlers/error.ts:20:10)\n      at process (./node_modules/process/index.js:30:5)\n    ";
        var frames = parser.parse(stackTrace);
        expect(frames.map(function (f) { return f.fileName; })).toEqual([
            'my-app/./src/components/Component.tsx',
            'C:/Users/test/project/src/handlers/error.ts',
            './node_modules/process/index.js'
        ]);
    });
    it('should normalize function names', function () {
        var stackTrace = "\n      at handleRequest[ashandler] (webpack://my-app/src/handlers/request.ts:10:15)\n      at <anonymous> (webpack://my-app/src/utils/async.ts:20:10)\n      at Module../src/components/Component.tsx (webpack://my-app/src/components/Component.tsx:30:5)\n    ";
        var frames = parser.parse(stackTrace);
        expect(frames.map(function (f) { return f.functionName; })).toEqual([
            'handleRequest[ashandler]',
            'anonymous',
            'Module../src/components/Component.tsx'
        ]);
    });
    it('should handle empty stack traces', function () {
        expect(parser.parse('')).toEqual([]);
        expect(parser.parse(null)).toEqual([]);
        expect(parser.parse(undefined)).toEqual([]);
    });
    it('should identify node modules', function () {
        var frame = {
            fileName: 'node_modules/react/index.js',
            lineNumber: 1,
            columnNumber: 1,
            functionName: 'test'
        };
        expect(parser.isNodeModule(frame)).toBe(true);
    });
    it('should identify user code', function () {
        var frame = {
            fileName: 'src/components/App.tsx',
            lineNumber: 1,
            columnNumber: 1,
            functionName: 'test'
        };
        expect(parser.isUserCode(frame)).toBe(true);
    });
});
//# sourceMappingURL=StackTraceParser.test.js.map