
export function submitEntry(wikitext, summary) {

    // Verify whether the script is running inside MediaWiki by checking the global mw object
    if (typeof mw === 'undefined') {

        console.warn('Not in a MediaWiki environment. Wikitext output:\n', wikitext);

    
        alert('Simulated Save! Check the browser console to view the generated wikitext.');

        // Stop execution early to prevent reference errors from calling non-existent MediaWiki APIs
        return;
    }

    
    const defaultSummary = summary || 'Creation: New entry in Tamazight / ⵜⴰⴳⵔⵜ: ⴰⵙⵏⵓⵍⴼⵓ ⵏ ⵓⵎⴰⴳⵔⴰⴷ';

    // Instantiate MediaWiki's official API client helper to manage HTTP requests
    const api = new mw.Api();

    return api.postWithToken('csrf', {

        // Specify the edit action to create or modify a page
        action: 'edit',

        // Retrieve the current target page name dynamically from the wiki configuration
        title: mw.config.get('wgPageName'),

        // Provide the wikitext payload that should become the page content
        text: wikitext,

        // Supply the edit summary to appear in the page history and Recent Changes log
        summary: defaultSummary,

        // Instruct the API to fail if the page already exists, preventing accidental overwrites
        createonly: true

    // Callback that executes when the API request finishes successfully
    }).done(function(data) {

        // Log the successful server response data to the developer console
        console.log('Saved successfully!', data);


        location.reload();

      
    }).fail(function(code, data) {

       
        console.error('API Error:', code, data);

        
        alert('Failed to save entry: ' + code);
    });
}
