import './ui/gadget.css';
import { buildUI } from './ui/formBuilder.js';
import { attachEvents } from './ui/event.js';

function initGadget() {
    if (typeof mw !== 'undefined' && mw.config.get('wgArticleId') !== 0) {
        return;
    }

    const contentArea = document.getElementById('mw-content-text');
    if (!contentArea) {
        return;
    }

    const ui = buildUI();
    contentArea.prepend(ui);
    attachEvents();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGadget);
} else {
    initGadget();
}
