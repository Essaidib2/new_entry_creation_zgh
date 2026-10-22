import { CONFIG } from '../config.js';

const pageTitle = typeof mw !== 'undefined' ? mw.config.get('wgTitle') : 'TestWord';

const state = {
    metadata: {
        tutlayt: CONFIG.langCode,
        awal: pageTitle,
    },
    lexicalData: {
        anaw: 'noun',
        tawsit: '',
        amdan: '',
        script: CONFIG.defaultScript,
    },
    phonetics: {
        asusru: '',
    },
    content: {
        anamek: [''],
    },
};

export function getState() {
    return state;
}

export function updateField(category, key, value, index) {
    const section = state[category];
    if (!section || !Object.prototype.hasOwnProperty.call(section, key)) {
        return;
    }

    const currentValue = section[key];
    if (Array.isArray(currentValue)) {
        const itemIndex = index === undefined ? 0 : index;
        if (!Number.isInteger(itemIndex) || itemIndex < 0) {
            return;
        }
        currentValue[itemIndex] = value;
        return;
    }

    section[key] = value;
}

export function updateState(category, key, value) {
    updateField(category, key, value);
}

export function updateAnamzk(index, value) {
    updateField('content', 'anamek', value, index);
}
