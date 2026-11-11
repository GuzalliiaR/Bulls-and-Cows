import createCustomElement from './element.js';
import { baseLabel, formatDuration } from './format.js';
export function renderRecordsTable(records) {
    if (records.length === 0) {
        return createCustomElement('p', {
            className: 'hint',
            text: 'Рекордов пока нет',
        });
    }
    const rows = records.map((record, index) => createCustomElement('tr', {
        children: [
            createCustomElement('td', { text: String(index + 1) }),
            createCustomElement('td', {
                text: `${baseLabel(record.base)} / ${record.length}`,
            }),
            createCustomElement('td', { text: String(record.attempts) }),
            createCustomElement('td', { text: formatDuration(record.durationMs) }),
        ],
    }));
    return createCustomElement('table', {
        className: 'records',
        children: [
            createCustomElement('thead', {
                children: [
                    createCustomElement('tr', {
                        children: [
                            createCustomElement('th', { text: '#' }),
                            createCustomElement('th', { text: 'Режим' }),
                            createCustomElement('th', { text: 'Попытки' }),
                            createCustomElement('th', { text: 'Время' }),
                        ],
                    }),
                ],
            }),
            createCustomElement('tbody', { children: rows }),
        ],
    });
}
//# sourceMappingURL=recordsTable.js.map