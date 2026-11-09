interface ElementOptions {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
  on?: { [K in keyof HTMLElementEventMap]?: EventListener };
  children?: Node[];
}

export default function createCustomElement<
  T extends keyof HTMLElementTagNameMap,
>(tag: T, options: ElementOptions): HTMLElementTagNameMap[T] {
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
      if (handler) node.addEventListener(type, handler);
    }
  }

  options.children?.forEach((child) => {
    node.append(child);
  });

  return node;
}
