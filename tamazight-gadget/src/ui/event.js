import { updateField } from '../core/state.js';
import { compileWikitext } from '../core/compiler.js';
import { submitEntry } from '../api/mediawiki.js';

export function attachEvents() {
    const previewArea = document.getElementById('zgh-preview-area');
    const submitBtn = document.getElementById('zgh-submit-btn');

    // Function to re-render the preview box whenever an input changes
    function updatePreview() {
        if (previewArea) {
            previewArea.value = compileWikitext();
        }
    }

    // Select all inputs, textareas, and dropdown selects inside the gadget container
    const formControls = document.querySelectorAll(
        '.zgh-gadget input, .zgh-gadget textarea, .zgh-gadget select'
    );

    // Bind real-time input events to update state and refresh preview
    formControls.forEach((element) => {
        const handler = (e) => {
            const fieldName = e.target.getAttribute('ⵉⵙⵎ') || e.target.id;
            const value = e.target.value;

            if (fieldName) {
                updateField(fieldName, value);
                updatePreview();
            }
        };

        element.addEventListener('input', handler);
        element.addEventListener('change', handler);
    });

    // Handle form submission
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const wikitext = compileWikitext();

            // Guard: Prevent submitting empty or placeholder content
            if (!wikitext || !wikitext.trim()) {
                alert('Please enter some content before submitting.');
                return;
            }

            // Visual feedback: Disable button while request is in flight
            const originalButtonText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'ⴰⵃⵟⵟⵓ...';

            const summary = 'ⴰⵙⵏⵓⵍⴼⵓ: ⴰⵙⵏⵓⵍⴼⵓ ⵏ ⵜⵓⴷⵉⴼⵜ ⵜⴰⵎⴰⵢⵏⵓⵜ';

            try {
                // Call API helper from src/api/mediawiki.js
                await submitEntry(wikitext, summary);
            } catch (err) {
                console.error('Submission encountered an error:', err);
            } finally {
                // Reset button state if submission failed or page didn't reload immediately
                submitBtn.disabled = false;
                submitBtn.textContent = originalButtonText;
            }
        });
    }

    // Run once on load to populate the initial preview template
    updatePreview();
}
