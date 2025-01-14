import { __makeTemplateObject } from "tslib";
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
export var OverlayContainer = styled(motion.div)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  ", "\n  width: ", "px;\n  height: ", "px;\n  background: ", ";\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n  opacity: ", ";\n  overflow: hidden;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n"], ["\n  position: fixed;\n  ", "\n  width: ", "px;\n  height: ", "px;\n  background: ", ";\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n  opacity: ", ";\n  overflow: hidden;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n"])), function (_a) {
    var position = _a.position;
    switch (position) {
        case 'top-right':
            return 'top: 20px; right: 20px;';
        case 'top-left':
            return 'top: 20px; left: 20px;';
        case 'bottom-right':
            return 'bottom: 20px; right: 20px;';
        case 'bottom-left':
            return 'bottom: 20px; left: 20px;';
    }
}, function (_a) {
    var size = _a.size;
    return size.width;
}, function (_a) {
    var size = _a.size;
    return size.height;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.background;
}, function (_a) {
    var opacity = _a.opacity;
    return opacity;
});
export var TabBar = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n  padding: 8px 8px 0;\n"], ["\n  display: flex;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n  padding: 8px 8px 0;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
export var Tab = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 8px 16px;\n  border: none;\n  background: ", ";\n  color: ", ";\n  border-radius: 6px 6px 0 0;\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 500;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  padding: 8px 16px;\n  border: none;\n  background: ", ";\n  color: ", ";\n  border-radius: 6px 6px 0 0;\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 500;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? theme.colors.background : 'transparent';
}, function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? theme.colors.primary : theme.colors.text;
}, function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? theme.colors.background : theme.colors.hover;
});
export var ContentArea = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  background: ", ";\n"], ["\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  background: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.background;
});
export var ActionBar = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 16px;\n  background: ", ";\n  border-top: 1px solid ", ";\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 16px;\n  background: ", ";\n  border-top: 1px solid ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
export var Button = styled.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 6px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  font-size: 12px;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  padding: 6px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  font-size: 12px;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.hover;
});
export var ResizeHandle = styled(motion.div)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 20px;\n  height: 20px;\n  cursor: se-resize;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  opacity: 0.5;\n  transition: opacity 0.2s;\n\n  &:hover {\n    opacity: 1;\n  }\n"], ["\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 20px;\n  height: 20px;\n  cursor: se-resize;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: ", ";\n  opacity: 0.5;\n  transition: opacity 0.2s;\n\n  &:hover {\n    opacity: 1;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=DebugOverlay.styles.js.map