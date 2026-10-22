const letterMap = new Map([
    ['a', 'ⴰ'],
    ['b', 'ⴱ'],
    ['c', 'ⵛ'],
    ['d', 'ⴷ'],
    ['e', 'ⴻ'],
    ['f', 'ⴼ'],
    ['g', 'ⴳ'],
    ['h', 'ⵀ'],
    ['i', 'ⵉ'],
    ['j', 'ⵊ'],
    ['k', 'ⴽ'],
    ['l', 'ⵍ'],
    ['m', 'ⵎ'],
    ['n', 'ⵏ'],
    ['o', 'ⵓ'],
    ['q', 'ⵇ'],
    ['r', 'ⵔ'],
    ['s', 'ⵙ'],
    ['t', 'ⵜ'],
    ['u', 'ⵓ'],
    ['v', 'ⵠ'],
    ['w', 'ⵡ'],
    ['x', 'ⵅ'],
    ['y', 'ⵢ'],
    ['z', 'ⵣ'],
    ['ḍ', 'ⴹ'],
    ['ṛ', 'ⵕ'],
    ['ṣ', 'ⵚ'],
    ['ṭ', 'ⵟ'],
    ['ẓ', 'ⵥ'],
    ['ɛ', 'ⵄ'],
    ['ɣ', 'ⵖ'],
    ['ḥ', 'ⵃ'],
    ['š', 'ⵛ'],
    ['č', 'ⵛ'],
    ['ž', 'ⵊ'],
    ['ث', 'ⵜ'],
    ['ج', 'ⵊ'],
    ['ح', 'ⵃ'],
    ['خ', 'ⵅ'],
    ['د', 'ⴷ'],
    ['ذ', 'ⴷ'],
    ['ر', 'ⵔ'],
    ['ز', 'ⵣ'],
    ['س', 'ⵙ'],
    ['ش', 'ⵛ'],
    ['ص', 'ⵚ'],
    ['ض', 'ⴹ'],
    ['ط', 'ⵟ'],
    ['ظ', 'ⵥ'],
    ['ع', 'ⵄ'],
    ['غ', 'ⵖ'],
    ['ف', 'ⴼ'],
    ['ق', 'ⵇ'],
    ['ك', 'ⴽ'],
    ['ل', 'ⵍ'],
    ['م', 'ⵎ'],
    ['ن', 'ⵏ'],
    ['ه', 'ⵀ'],
    ['ة', 'ⵜ'],
    ['و', 'ⵡ'],
    ['ي', 'ⵢ'],
    ['ى', 'ⵢ'],
    ['ا', 'ⴰ'],
    ['أ', 'ⴰ'],
    ['إ', 'ⴰ'],
    ['آ', 'ⴰ'],
]);

const digraphMap = new Map([
    ['gh', 'ⵖ'],
    ['kh', 'ⵅ'],
    ['sh', 'ⵛ'],
]);

export function transliterateToTifinagh(value) {
    const characters = Array.from(value);
    let result = '';

    for (let index = 0; index < characters.length; index += 1) {
        const pair = `${characters[index]}${characters[index + 1] || ''}`.toLowerCase();
        const digraph = digraphMap.get(pair);

        if (digraph) {
            result += digraph;
            index += 1;
            continue;
        }

        const character = characters[index];
        result += letterMap.get(character.toLowerCase()) || character;
    }

    return result;
}
