(function () {
    'use strict';

    const CONFIG = {
        langCode: 'zgh',
        defaultScript: 'Tfng',
        templates: {
            pos: 'pos',
            gender: 'g',
            ipa: 'IPA'
        }
    };

    const pageTitle = (typeof mw !== 'undefined') ? mw.config.get('wgTitle') : '';

    let state = {
        tutlayt: CONFIG.langCode,
        awalLatin: '',
        awalTifinagh: pageTitle || '',
        pos: 'noun',
        gender: '',
        number: '',
        plural: '',
        aorist: '',
        perfective: '',
        imperfective: '',
        negPerfective: '',
        ipa: '',
        definitions: [''],
        examples: [],
        synonyms: ''
    };

    function getState() {
        return state;
    }

    // ---------------------------------------------------------------- utils

    function latinToTifinagh(text) {
        if (!text) return '';

        const map = {
            'gʷ': 'ⴳⵯ', 'kʷ': 'ⴽⵯ', 'ʷ': 'ⵯ',
            'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'ḍ': 'ⴹ',
            'e': 'ⴻ', 'f': 'ⴼ', 'g': 'ⴳ', 'h': 'ⵀ', 'ḥ': 'ⵃ',
            'i': 'ⵉ', 'j': 'ⵊ', 'k': 'ⴽ', 'l': 'ⵍ', 'm': 'ⵎ',
            'n': 'ⵏ', 'q': 'ⵇ', 'r': 'ⵔ', 'ṛ': 'ⵕ', 's': 'ⵙ',
            'ṣ': 'ⵚ', 't': 'ⵜ', 'ṭ': 'ⵟ', 'u': 'ⵓ', 'w': 'ⵡ',
            'x': 'ⵅ', 'y': 'ⵢ', 'z': 'ⵣ', 'ẓ': 'ⵥ',
            'ɣ': 'ⵖ', 'ɛ': 'ⵄ'
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
                result += map[char1] || text[i];
                i++;
            }
        }
        return result;
    }

    function posTemplate() {
        return `{{${state.pos}|${state.tutlayt}}}`;
    }

    // ------------------------------------------------------------- compiler

    function compileWikitext() {
        const s = getState();
        const word = (s.awalTifinagh || s.awalLatin || '').trim() || '(ⵜⴰⴳⵓⵔⵉ / word)';
        let w = '';

        // Language header
        w += `== {{lang|${s.tutlayt}}} ==\n\n`;

        // Part of speech
        w += `=== ${posTemplate()} ===\n`;

        // Headword line
        w += `'''${word}'''`;
        if (s.awalLatin.trim()) w += ` (${s.awalLatin.trim()})`;
        if (s.gender) w += ` {{g|${s.gender}}}`;
        if (s.number) w += ` {{g|${s.number}}}`;
        w += `\n`;

        // Pronunciation
        if (s.ipa.trim()) {
            w += `* {{IPA|${s.ipa.trim()}|lang=${s.tutlayt}}}\n`;
        }

        // POS-specific morphology
        if (s.pos === 'verb') {
            if (s.aorist.trim())       w += `* Aorist: ${s.aorist.trim()}\n`;
            if (s.perfective.trim())   w += `* Perfective: ${s.perfective.trim()}\n`;
            if (s.imperfective.trim()) w += `* Imperfective: ${s.imperfective.trim()}\n`;
            if (s.negPerfective.trim())w += `* Negative perfective: ${s.negPerfective.trim()}\n`;
        } else {
            if (s.plural.trim()) {
                const otherLabel = (s.number === 'p') ? 'Singular' : 'Plural';
                w += `* ${otherLabel}: ${s.plural.trim()}\n`;
            }
        }
        w += `\n`;

        // Definitions (+ examples attached to the last definition)
        const defs = s.definitions.filter(d => d.trim() !== '');
        if (defs.length === 0) {
            w += `# \n`;
        } else {
            defs.forEach((def, idx) => {
                w += `# ${def.trim()}\n`;
                // attach examples under the first definition
                if (idx === 0) {
                    s.examples.forEach((ex) => {
                        if (ex.tam.trim()) {
                            w += `#: ''${ex.tam.trim()}''`;
                            if (ex.tr.trim()) w += ` — ${ex.tr.trim()}`;
                            w += `\n`;
                        }
                    });
                }
            });
        }
        w += `\n`;

        // Relations
        if (s.synonyms.trim()) {
            w += `==== Synonyms ====\n${s.synonyms.trim()}\n\n`;
        }

        return w.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
    }

    // --------------------------------------------------------------- submit

    function submitEntry(wikitext, summary) {
        if (typeof mw === 'undefined') {
            console.warn('Not in MediaWiki environment. Simulated Output:\n', wikitext);
            alert('Simulated Save! Check console for the generated wikitext.');
            return;
        }

        const api = new mw.Api();
        return api.postWithToken('csrf', {
            action: 'edit',
            title: mw.config.get('wgPageName'),
            text: wikitext,
            summary: summary,
            createonly: true
        }).done(function () {
            location.reload();
        }).fail(function (code, data) {
            console.error('API Error:', code, data);
            alert('Failed to save entry: ' + code);
        });
    }

    // ------------------------------------------------------------ UI helpers

    function el(tag, props) {
        const node = document.createElement(tag);
        if (props) Object.assign(node, props);
        return node;
    }

    function createLabel(text, element) {
        const label = el('label');
        label.textContent = text + ' ';
        label.appendChild(element);
        return label;
    }

    function createInput(field, placeholder) {
        const input = el('input', { type: 'text' });
        input.dataset.field = field;
        if (placeholder) input.placeholder = placeholder;
        input.value = state[field] || '';
        return input;
    }

    function createSelect(field, options) {
        const select = el('select');
        select.dataset.field = field;
        options.forEach(opt => {
            const o = el('option', { value: opt.value, textContent: opt.text });
            if (state[field] === opt.value) o.selected = true;
            select.appendChild(o);
        });
        return select;
    }

    function fieldset(tam, eng) {
        const fs = el('fieldset');
        const lg = el('div', { className: 'zgh-legend' });
        lg.appendChild(starSpan());
        lg.appendChild(el('span', { className: 'zgh-leg-tam', textContent: tam }));
        lg.appendChild(el('span', { className: 'zgh-leg-sep', textContent: ' / ' }));
        lg.appendChild(el('span', { className: 'zgh-leg-eng', textContent: eng }));
        fs.appendChild(lg);
        return fs;
    }

    function starSpan() {
        const s = el('span', { className: 'zgh-star' });
        s.setAttribute('aria-hidden', 'true');
        return s;
    }

    // ------------------------------------------------------------- build UI

    function buildUI() {
        const container = el('div', { id: 'zgh-gadget-container', className: 'zgh-gadget' });

        // --- Header band (artwork lifted from the approved design) ------
        const header = el('div', { className: 'tzm-header' });
        header.setAttribute('role', 'img');
        header.setAttribute('aria-label', 'ⵙⵏⵓⵍⴼⵓ ⵜⴰⴳⵓⵔⵉ — Create / Edit Entry');
        container.appendChild(header);

        // --- Two-column body -------------------------------------------
        const body = el('div', { className: 'zgh-body' });
        const colForm = el('div', { className: 'zgh-col-form' });
        const colPrev = el('div', { className: 'zgh-col-preview' });

        // Word
        const fsWord = fieldset('ⵜⴰⴳⵓⵔⵉ', 'Word');
        const latinInput = createInput('awalLatin', 'Type in Latin, e.g. amazigh');
        fsWord.appendChild(createLabel('ⵜⴰⴳⵓⵔⵉ ⵙ ⵓⵍⴰⵜⵉⵏ:', latinInput));
        colForm.appendChild(fsWord);

        // Grammar
        const fsGram = fieldset('ⵜⴰⵊⵕⵕⵓⵎⵜ', 'Grammar');
        const anawSelect = createSelect('pos', [
            { value: 'noun', text: 'ⵉⵙⵎ' },
            { value: 'verb', text: 'ⴰⵎⵢⴰⴳ' },
            { value: 'adjective', text: 'ⴰⴼⵔⵉⵙ' }
        ]);
        fsGram.appendChild(createLabel('ⴰⵏⴰⵡ (Part of speech):', anawSelect));

        const nounBlock = el('div', { id: 'zgh-noun-block', className: 'zgh-grid2' });
        nounBlock.appendChild(createLabel('ⴰⵏⴰⵡ:', createSelect('gender', [
            { value: '', text: '-' },
            { value: 'm', text: 'ⴰⵎⴰⵢ' },
            { value: 'f', text: 'ⵓⵏⵜⵉ' }
        ])));
        nounBlock.appendChild(createLabel('ⴰⵎⴹⴰⵏ:', createSelect('number', [
            { value: '', text: '-' },
            { value: 's', text: 'ⴰⵎⵢⵉⵡⵏ' },
            { value: 'p', text: 'ⴰⵎⴰⴳⵓⵜ' }
        ])));
        const counterInput = createInput('plural', 'e.g. ⵉⵎⴰⵣⵉⵖⵏ');
        const counterLabel = el('label', { className: 'tzm-span2' });
        counterLabel.appendChild(el('span', { id: 'zgh-counterform-text', textContent: 'ⴰⵎⴰⴳⵓⵜ: ' }));
        counterLabel.appendChild(counterInput);
        nounBlock.appendChild(counterLabel);
        fsGram.appendChild(nounBlock);

        const verbBlock = el('div', { id: 'zgh-verb-block', className: 'zgh-grid2' });
        verbBlock.appendChild(createLabel('ⵓⵔⵎⵉⵔ:', createInput('aorist', 'bare stem')));
        verbBlock.appendChild(createLabel('ⵓⵙⵎⵉⴷ:', createInput('perfective', '')));
        verbBlock.appendChild(createLabel('ⴰⵔⵓⵙⵎⵉⴷ:', createInput('imperfective', '')));
        verbBlock.appendChild(createLabel('ⵓⵙⵎⵉⴷ ⴰⵏⴰⴱⴰⵡ:', createInput('negPerfective', '')));
        fsGram.appendChild(verbBlock);
        colForm.appendChild(fsGram);

        // Pronunciation
        const fsMeta = fieldset('ⴰⵙⵓⵙⵔⵓ', 'Pronunciation');
        fsMeta.appendChild(createLabel('ⴰⵙⵓⵙⵔⵓ (IPA):', createInput('ipa', 'e.g. a.ma.ziɣ')));
        colForm.appendChild(fsMeta);

        // Definitions
        const fsDef = fieldset('ⴰⵏⴰⵎⴽ', 'Definitions');
        fsDef.appendChild(el('div', { id: 'zgh-def-list' }));
        const addDef = el('button', { type: 'button', className: 'zgh-add', textContent: '+ ⵔⵏⵓ ⴰⵏⴰⵎⴽ' });
        addDef.dataset.action = 'add-def';
        fsDef.appendChild(addDef);
        colForm.appendChild(fsDef);

        // Examples
        const fsEx = fieldset('ⵉⵎⴷⵢⴰⵜⵏ', 'Examples');
        const exHelp = el('div', { className: 'field-help zgh-ex-help' });
        exHelp.appendChild(el('div', {
            className: 'zgh-help-tam',
            textContent: 'ⵜⴰⴼⵢⵉⵔⵜ ⵉⵙⴽⴰⵏⵏ ⵜⴰⴳⵓⵔⵉ ⴳ ⵓⵙⵎⵔⵙ, ⵙ ⵜⵙⵓⵖⵍⵜ ⵏⵏⵙ'
        }));
        exHelp.appendChild(el('div', {
            textContent: 'A sentence showing the word in use, with its translation.'
        }));
        exHelp.appendChild(el('div', {
            className: 'tzm-help-ex',
            textContent: 'e.g.  ⴰⵔ ⵙⴰⵡⴰⵍⵖ ⵜⵓⵜⵍⴰⵢⵜ ⵉⵏⵓ  —  “I speak my language”'
        }));
        fsEx.appendChild(exHelp);
        fsEx.appendChild(el('div', { id: 'zgh-ex-list' }));
        const addEx = el('button', { type: 'button', className: 'tzm-add', textContent: '+ ⵔⵏⵓ ⴰⵎⴷⵢⴰ' });
        addEx.dataset.action = 'add-ex';
        fsEx.appendChild(addEx);
        colForm.appendChild(fsEx);

        // Related words
        const fsRel = fieldset('ⵜⵉⴳⵓⵔⵉⵡⵉⵏ ⵉⵣⴷⵉⵏ', 'Related words');
        fsRel.appendChild(createLabel('ⵉⴽⵏⵉⵡⵏ:', createInput('synonyms', 'comma-separated')));
        colForm.appendChild(fsRel);

        // Save
        const submitBtn = el('button', { id: 'zgh-submit-btn', textContent: 'ⵃⴹⵓ' });
        colForm.appendChild(submitBtn);

        // Preview column
        const prevCard = el('div', { className: 'zgh-preview-card' });
        const prevTitle = el('div', { className: 'zgh-preview-title' });
        prevTitle.appendChild(starSpan());
        prevTitle.appendChild(el('span', { textContent: 'ⴰⵙⴽⴰⵏ (Wikitext preview)' }));
        prevCard.appendChild(prevTitle);
        const previewArea = el('textarea', { id: 'tzm-preview-area', readOnly: true });
        prevCard.appendChild(previewArea);
        colPrev.appendChild(prevCard);

        body.appendChild(colForm);
        body.appendChild(colPrev);
        container.appendChild(body);

        return container;
    }

    // ------------------------------------------------------- dynamic lists

    function renderDefinitions() {
        const box = document.getElementById('tzm-def-list');
        if (!box) return;
        box.innerHTML = '';
        state.definitions.forEach((d, i) => {
            const row = el('div', { className: 'zgh-row' });
            const inp = el('input', { type: 'text', value: d, placeholder: 'ⴰⵏⴰⵎⴽ' + (i + 1) });
            inp.dataset.list = 'definitions';
            inp.dataset.index = i;
            row.appendChild(inp);
            const del = el('button', { type: 'button', className: 'zgh-del', textContent: '✕' });
            del.dataset.action = 'del-def';
            del.dataset.index = i;
            row.appendChild(del);
            box.appendChild(row);
        });
    }

    function renderExamples() {
        const box = document.getElementById('zgh-ex-list');
        if (!box) return;
        box.innerHTML = '';
        state.examples.forEach((ex, i) => {
            const row = el('div', { className: 'zgh-row tzm-ex-row' });
            const tam = el('input', { type: 'text', value: ex.zgh, placeholder: 'ⴰⵎⴷⵢⴰ (ⵜⴰⵎⴰⵣⵉⵖⵜ)' });
            tam.dataset.list = 'exampleZgh';
            tam.dataset.index = i;
            const tr = el('input', { type: 'text', value: ex.tr, placeholder: 'ⵜⴰⵙⵓⵖⵍⵜ' });
            tr.dataset.list = 'exampleTr';
            tr.dataset.index = i;
            const del = el('button', { type: 'button', className: 'zgh-del', textContent: '✕' });
            del.dataset.action = 'del-ex';
            del.dataset.index = i;
            row.appendChild(zgh);
            row.appendChild(tr);
            row.appendChild(del);
            box.appendChild(row);
        });
    }

    function updatePosVisibility() {
        const isVerb = state.pos === 'verb';
        const nb = document.getElementById('zgh-noun-block');
        const vb = document.getElementById('zgh-verb-block');
        if (nb) nb.style.display = isVerb ? 'none' : '';
        if (vb) vb.style.display = isVerb ? '' : 'none';
    }

    // Flip the morphology field: headword singular -> ask plural; headword plural -> ask singular
    function updateCounterForm() {
        const txt = document.getElementById('zgh-counterform-text');
        const inp = document.querySelector('#zgh-noun-block input[data-field="plural"]');
        if (!txt) return;
        if (state.number === 'p') {
            txt.textContent = 'ⴰⵎⵢⵉⵡⵏ (Singular form): ';
            if (inp) inp.placeholder = 'e.g. amaziɣ';
        } else {
            txt.textContent = 'ⴰⵎⴰⴳⵓⵜ (Plural form): ';
            if (inp) inp.placeholder = 'e.g. imaziɣen';
        }
    }

    function renderPreview() {
        const preview = document.getElementById('zgh-preview-area');
        if (preview) preview.value = compileWikitext();
    }

    // -------------------------------------------------------------- events

    function attachEvents() {
        const container = document.getElementById('zgh-gadget-container');
        if (!container) return;

        const onChange = (e) => {
            const t = e.target;
            const list = t.dataset.list;
            const field = t.dataset.field;

            if (list) {
                const idx = parseInt(t.dataset.index, 10);
                if (list === 'definitions') {
                    state.definitions[idx] = t.value;
                } else if (list === 'exampleTam') {
                    const pos = t.selectionStart;
                    t.value = latinToTifinagh(t.value);
                    try { t.setSelectionRange(pos, pos); } catch (err) { /* noop */ }
                    state.examples[idx].tam = t.value;
                } else if (list === 'exampleTr') {
                    state.examples[idx].tr = t.value;
                }
            } else if (field) {
                if (field === 'awalLatin') {
                    state.awalLatin = t.value;
                    state.awalTifinagh = latinToTifinagh(t.value);
                } else {
                    state[field] = t.value;
                    if (field === 'pos') updatePosVisibility();
                    if (field === 'number') updateCounterForm();
                }
            } else {
                return;
            }
            renderPreview();
        };

        container.addEventListener('input', onChange);
        container.addEventListener('change', onChange);

        container.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (!action) return;
            if (action === 'add-def') {
                state.definitions.push('');
                renderDefinitions();
            } else if (action === 'del-def') {
                state.definitions.splice(parseInt(e.target.dataset.index, 10), 1);
                if (state.definitions.length === 0) state.definitions.push('');
                renderDefinitions();
            } else if (action === 'add-ex') {
                state.examples.push({ tam: '', tr: '' });
                renderExamples();
            } else if (action === 'del-ex') {
                state.examples.splice(parseInt(e.target.dataset.index, 10), 1);
                renderExamples();
            }
            renderPreview();
        });

        const submitBtn = document.getElementById('zgh-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const wikitext = compileWikitext();
                submitEntry(wikitext, 'ⵙⵏⵓⵍⴼⵉⵖ ⵜⵓⴷⵉⴼⵜ ⵜⴰⵎⴰⵢⵏⵓⵜ');
            });
        }

        renderDefinitions();
        renderExamples();
        updatePosVisibility();
        updateCounterForm();
        renderPreview();
    }

    // ---------------------------------------------------------------- init

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
