(function () {
    'use strict';

    const CONFIG = {
        langCode: 'tzm',
        defaultScript: 'Tfng',
        templates: {
            pos: 'pos',
            gender: 'g',
            ipa: 'IPA'
        }
    };

    const pageTitle = (typeof mw !== 'undefined') ? mw.config.get('wgTitle') : 'AwalTest';

    let state = {
        metadata: {
            tutlayt: CONFIG.langCode,
            awal: pageTitle,
        },
        lexicalData: {
            anaw: 'noun',
            tawsit: '',
            amdan: '',
            agemmay: CONFIG.defaultScript,
        },
        phonetics: {
            asusru: '',
        },
        content: {
            anamek: [''],
        }
    };

    function getState() {
        return state;
    }

    function updateState(category, key, value) {
        if (state[category] && state[category].hasOwnProperty(key)) {
            state[category][key] = value;
        }
    }

    function updateAnamek(index, value) {
        state.content.anamek[index] = value;
    }

    function latinToTifinagh(text) {
        if (!text) return '';

        const map = {
            'gw': 'ⴳⵯ', 'kw': 'ⴽⵯ',

            'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'ḍ': 'ⴹ',
            'e': 'ⴻ', 'f': 'ⴼ', 'g': 'ⴳ', 'h': 'ⵀ', 'ḥ': 'ⵃ',
            'i': 'ⵉ', 'j': 'ⵊ', 'k': 'ⴽ', 'l': 'ⵍ', 'm': 'ⵎ',
            'n': 'ⵏ', 'q': 'ⵇ', 'r': 'ⵔ', 'ṛ': 'ⵕ', 's': 'ⵙ',
            'ṣ': 'ⵚ', 't': 'ⵜ', 'ṭ': 'ⵟ', 'u': 'ⵓ', 'w': 'ⵡ',
            'x': 'ⵅ', 'y': 'ⵢ', 'z': 'ⵣ', 'ẓ': 'ⵥ',
            'ɣ': 'ⵖ', 'ɛ': 'ⵄ', 'ǧ': 'ⴵ', 'č': 'ⵞ',

            'ⴳw': 'ⴳⵯ', 'ⴽw': 'ⴽⵯ'
        };

        let result = '';
        let i = 0;
        let lower = text.toLowerCase();

        while (i < lower.length) {
            let char2 = lower.substring(i, i + 2);
            if (map[char2]) {
                result += map[char2];
                i += 2;
            } else {
                let char1 = lower[i];
                // If not in map, keep original character (spaces, punctuation, numbers)
                result += map[char1] || text[i];
                i++;
            }
        }
        return result;
    }

    function compileWikitext() {
        const data = getState();
        let wikitext = `== {{lang|${data.metadata.tutlayt}}} ==\n`;

        wikitext += `=== {{${data.lexicalData.anaw}|${data.metadata.tutlayt}}} ===\n`;

        wikitext += `'''${data.metadata.awal}'''`;
        if (data.lexicalData.tawsit) wikitext += ` {{g|${data.lexicalData.tawsit}}}`;
        if (data.lexicalData.amdan) wikitext += ` {{g|${data.lexicalData.amdan}}}`;
        wikitext += `\n\n`;

        if (data.phonetics.asusru) {
            wikitext += `* {{IPA|${data.phonetics.asusru}|lang=${data.metadata.tutlayt}}}\n\n`;
        }

        data.content.anamek.forEach((def) => {
            if (def.trim() !== '') {
                wikitext += `# ${def}\n`;
            }
        });

        return wikitext;
    }

    function submitEntry(wikitext, summary) {
        if (typeof mw === 'undefined') {
            console.warn('Not in MediaWiki environment. Simulated Output:\n', wikitext);
            alert('Simulated Save! Check console.');
            return;
        }

        const api = new mw.Api();
        return api.postWithToken('csrf', {
            action: 'edit',
            title: mw.config.get('wgPageName'),
            text: wikitext,
            summary: summary,
            createonly: true
        }).done(function (data) {
            location.reload();
        }).fail(function (code, data) {
            console.error("API Error:", code, data);
            alert('Failed to save entry: ' + code);
        });
    }

    function buildUI() {
        const container = document.createElement('div');
        container.id = 'tzm-gadget-container';
        container.className = 'tzm-gadget';

        const title = document.createElement('h3');
        title.textContent = 'ⵙⵏⵓⵍⴼⵓ ⴰⵡⴰⵍ (Create Entry)';
        container.appendChild(title);

        const anawSelect = createSelect('lexicalData', 'anaw', [
            { value: 'noun', text: 'ⵉⵙⵎ (Noun)' },
            { value: 'verb', text: 'ⴰⵎⵢⴰⴳ (Verb)' },
            { value: 'adjective', text: 'ⴰⵔⴱⵉⴱ (Adjective)' }
        ]);
        container.appendChild(createLabel('ⴰⵏⴰⵡ (Anaw):', anawSelect));

        const tawsitSelect = createSelect('lexicalData', 'tawsit', [
            { value: '', text: '-' },
            { value: 'm', text: 'ⴰⵎⴰⵍⴰⵢ (Masculine)' },
            { value: 'f', text: 'ⵓⵏⵜⵉ (Feminine)' }
        ]);
        container.appendChild(createLabel('ⵜⴰⵡⵙⵉⵜ (Tawsit):', tawsitSelect));

        const amdanSelect = createSelect('lexicalData', 'amdan', [
            { value: '', text: '-' },
            { value: 's', text: 'ⴰⵙⵓⴼ (Singular)' },
            { value: 'p', text: 'ⴰⵙⴳⵜ (Plural)' }
        ]);
        container.appendChild(createLabel('ⴰⵎⴹⴰⵏ (Amdan):', amdanSelect));

        const asusruInput = createInput('phonetics', 'asusru', 'text', 'e.g. ⴰⵎⴰⵣⵉⵖ');
        container.appendChild(createLabel('ⴰⵙⵓⵙⵔⵓ (Asusru/IPA):', asusruInput));

        // The definition input where auto-transliteration will happen
        const anamekInput = document.createElement('input');
        anamekInput.type = 'text';
        anamekInput.dataset.category = 'content';
        anamekInput.dataset.key = 'anamek';
        anamekInput.dataset.index = '0';
        container.appendChild(createLabel('ⴰⵏⴰⵎⴽ 1 (Definition):', anamekInput));

        const submitBtn = document.createElement('button');
        submitBtn.id = 'tzm-submit-btn';
        submitBtn.textContent = 'ⵃⵔⵣ / ⵙⴽⵛⵎ (Save)';
        container.appendChild(submitBtn);

        const previewArea = document.createElement('textarea');
        previewArea.id = 'tzm-preview-area';
        previewArea.readOnly = true;
        container.appendChild(previewArea);

        return container;
    }

    function createInput(category, key, type, placeholder = '') {
        const input = document.createElement('input');
        input.type = type;
        input.dataset.category = category;
        input.dataset.key = key;
        input.placeholder = placeholder;
        return input;
    }

    function createSelect(category, key, options) {
        const select = document.createElement('select');
        select.dataset.category = category;
        select.dataset.key = key;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            select.appendChild(option);
        });
        return select;
    }

    function createLabel(text, element) {
        const label = document.createElement('label');
        label.textContent = text + ' ';
        label.appendChild(element);
        return label;
    }

    function attachEvents() {
        const container = document.getElementById('tzm-gadget-container');
        if (!container) return;

        container.addEventListener('input', (e) => {
            const target = e.target;

            if (target.dataset.category) {
                if (target.dataset.key === 'anamek') {
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const oldLength = target.value.length;

                    target.value = latinToTifinagh(target.value);

                    const newLength = target.value.length;
                    target.setSelectionRange(start - (oldLength - newLength), end - (oldLength - newLength));

                    updateAnamek(parseInt(target.dataset.index, 10), target.value);
                } else {
                    updateState(target.dataset.category, target.dataset.key, target.value);
                }

                const preview = document.getElementById('tzm-preview-area');
                if (preview) preview.value = compileWikitext();
            }
        });

        const submitBtn = document.getElementById('tzm-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const wikitext = compileWikitext();
                submitEntry(wikitext, 'Siles awal amaynu (Created new entry)');
            });
        }

        // Populate the initial preview on load
        const preview = document.getElementById('tzm-preview-area');
        if (preview) preview.value = compileWikitext();
    }

    function initGadget() {
        if (typeof mw !== 'undefined' && mw.config.get('wgArticleId') !== 0) {
            return;
        }

        const contentArea = document.getElementById('mw-content-text') || document.body;
        const ui = buildUI();
        contentArea.prepend(ui);
        attachEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGadget);
    } else {
        initGadget();
    }

})();
