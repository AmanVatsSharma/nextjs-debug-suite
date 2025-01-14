import '@testing-library/jest-dom';
// Mock ResizeObserver
global.ResizeObserver = /** @class */ (function () {
    function ResizeObserver() {
    }
    ResizeObserver.prototype.observe = function () { };
    ResizeObserver.prototype.unobserve = function () { };
    ResizeObserver.prototype.disconnect = function () { };
    return ResizeObserver;
}());
// Mock IntersectionObserver
global.IntersectionObserver = /** @class */ (function () {
    function IntersectionObserver() {
    }
    IntersectionObserver.prototype.observe = function () { };
    IntersectionObserver.prototype.unobserve = function () { };
    IntersectionObserver.prototype.disconnect = function () { };
    return IntersectionObserver;
}());
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(function (query) { return ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }); }),
});
// Mock requestAnimationFrame
global.requestAnimationFrame = function (callback) { return setTimeout(callback, 0); };
global.cancelAnimationFrame = function (id) { return clearTimeout(id); };
//# sourceMappingURL=setup.js.map