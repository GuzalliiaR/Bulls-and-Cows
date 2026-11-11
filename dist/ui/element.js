export default function createCustomElement(tag, options) {
    const node = document.createElement(tag);
    if (options.className) {
        node.className = options.className;
    }
    if (options.text) {
        node.textContent = options.text;
    }
    if (options.attrs) {
        for (const name in options.attrs) {
            node.setAttribute(name, options.attrs[name]);
        }
    }
    if (options.on) {
        for (const [type, handler] of Object.entries(options.on)) {
            if (handler)
                node.addEventListener(type, handler);
        }
    }
    options.children?.forEach((child) => {
        node.append(child);
    });
    return node;
}
//# sourceMappingURL=element.js.map