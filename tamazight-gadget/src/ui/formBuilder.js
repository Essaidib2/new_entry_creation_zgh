export function buildUI() {
    const container = document.createElement('div');
    container.id = 'zgh-gadget-container';
    container.className = 'zgh-gadget';

    const title = document.createElement('h3');
    title.textContent = 'ⵙⵏⵓⵍⴼⵓ ⵜⵓⴷⵉⴼⵜ';
    container.appendChild(title);

    // Dropdowns
    const anawSelect = createSelect('lexicalData', 'ⴰⵙⵎⵉⵍ ⵏ ⵜⴳⵓⵔⵉ', [
        { value: 'noun', text: 'ⵉⵙⵎ' },
        { value: 'proper noun', text: 'ⵉⵙⵎ ⵉⵥⵍⵉⵏ' },
        { value: 'verb', text: 'ⴰⵎⵢⴰⴳ' },
        { value: 'adjective', text: 'ⴰⴼⵔⵉⵙ' },
        { value: 'adverb', text: 'ⴰⵎⵔⵏⵓ' },
        { value: 'conjunction', text: 'ⵜⴰⵙⵖⵓⵏⵜ' },
        { value: 'preposition', text: 'ⵜⴰⵏⵣⵖⵜ' },
        { value: 'pronoun', text: 'ⴰⵎⵇⵇⵉⵎ' },
        { value: 'interjection', text: 'ⵜⴰⵢⵢⴰⵢⵜ' },
        
    ]);
    container.appendChild(createLabel('ⴰⵏⴰⵡ:', anawSelect));

    const tawsitSelect = createSelect('lexicalData', 'ⴰⵏⴰⵡ ⵏ ⵜⴳⵓⵔⵢ', [
        { value: '', text: '-' },
        { value: 'm', text: 'ⴰⵎⴰⵢ' },
        { value: 'f', text: 'ⵓⵏⵜⵉ' }
    ]);
    container.appendChild(createLabel('ⵜⴰⵡⵙⵉⵜ (Tawsit):', tawsitSelect));

    const amdanSelect = createSelect('lexicalData', 'ⴰⵎⴹⴰⵏ', [
        { value: '', text: '-' },
        { value: 's', text: 'ⴰⵎⵢⵉⵡⵏ' },
        { value: 'p', text: 'ⴰⵎⴰⴳⵓⵜ' }
    ]);
    container.appendChild(createLabel('ⴰⵎⴹⴰⵏ:', amdanSelect));

    // Inputs
    const asusruInput = createInput('phonetics', 'asusru', 'text', 'e.g. ⴰⵎⴰⵣⵉⵖ');
    container.appendChild(createLabel('ⴰⵙⵓⵙⵔⵓ (IPA):', asusruInput));

    const anamekInput = document.createElement('input');
    anamekInput.type = 'text';
    anamekInput.dataset.category = 'content';
    anamekInput.dataset.key = 'ⴰⵏⴰⵎⴽ';
    anamekInput.dataset.index = '0';
    container.appendChild(createLabel('ⴰⵏⴰⵎⴽ 1:', anamekInput));

    // Submit Button
    const submitBtn = document.createElement('button');
    submitBtn.id = 'zgh-submit-btn';
    submitBtn.textContent = 'ⵃⴹⵓ';
    container.appendChild(submitBtn);

    // Live Preview
    const previewArea = document.createElement('textarea');
    previewArea.id = 'zgh-preview-area';
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
