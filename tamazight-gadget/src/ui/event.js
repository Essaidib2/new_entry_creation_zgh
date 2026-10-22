import { updateField } from '../core/state.js';
import { compileWikitext } from '../core/compiler.js';
import { transliterateToTifinagh } from '../core/transliteration.js';
import { submitEntry } from '../api/mediawiki.js';

export function attachEvents() {
    const previewArea = document.getElementById('tzm-preview-area');
    const submitBtn = document.getElementById('tzm-submit-btn');
    const formControls = document.querySelectorAll(
        '.tzm-gadget input, .tzm-gadget textarea, .tzm-gadget select'
    );

    function updatePreview() {
        if (previewArea) {
            previewArea.value = compileWikitext();
        }
    }

    formControls.forEach((element) => {
        const handler = (event) => {
            const target = event.currentTarget;
            const { category, key, index } = target.dataset;
            if (!category || !key) {
                return;
            }

            let value = target.value;
            const isEditableText =
                target.matches('input[type="text"], textarea:not([readonly])');
            const isIpaField = category === 'phonetics' && key === 'asusru';

            if (isEditableText && !isIpaField) {
                const originalValue = value;
                const selectionStart = target.selectionStart;
                const selectionEnd = target.selectionEnd;
                const convertedValue = transliterateToTifinagh(value);

                if (convertedValue !== value) {
                    value = convertedValue;
                    target.value = value;

                    if (selectionStart !== null && selectionEnd !== null) {
                        target.setSelectionRange(
                            transliterateToTifinagh(originalValue.slice(0, selectionStart)).length,
                            transliterateToTifinagh(originalValue.slice(0, selectionEnd)).length
                        );
                    }
                }
            }

            updateField(category, key, value, index === undefined ? undefined : Number(index));
            updatePreview();
        };

        element.addEventListener('input', handler);
        element.addEventListener('change', handler);
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            const wikitext = compileWikitext();
            if (!wikitext.trim()) {
                alert('Please enter some content before submitting.');
                return;
            }

            const originalButtonText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving... / ⴰⵔ ⵉⵜⵜⵃⴼⴰⴹ...';

            const summary = 'Creation: New entry in Tamazight / ⵜⴰⴳⵔⵜ: ⴰⵙⵏⵓⵍⴼⵓ ⵏ ⵓⵎⴰⴳⵔⴰⴷ';

            try {
                await submitEntry(wikitext, summary);
            } catch (error) {
                console.error('Submission encountered an error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalButtonText;
            }
        });
    }

    updatePreview();
}
