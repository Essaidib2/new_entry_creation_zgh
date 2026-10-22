  import { buildUI } from './ui/formBuilder.js';                                                   
  import { attachEvents } from './ui/events.js';                                                   
                                                                                                   
  function initGadget() {                                                                          
  if(typeof mw !== 'undefined' && mw.config.get('wgArticleId') !== 0){                             
    return;                                                                                        
  }                                                                                                
  const contentArea = document.getElementById ('mw-content-text')                                  
  const ui = buildUI();                                                                            
  contentArea.prepend(ui);                                                                         
  attachEvents();                                                                                  
  }                                                                                                
                                                                                                   
  if (document.readyState === 'loading') {                                                         
      document.addEventListener('DOMContentLoaded', initGadget);                                   
  } else {                                                                                         
      initGadget();                                                                                
  }                                                                                                
  src/styles/gadget.css :                                                                          
  .tzm-gadget {                                                                                    
      background-color: #f8f9fa;                                                                   
      border: 1px solid #a2a9b1;                                                                   
      padding: 20px;                                                                               
      margin-bottom: 20px;                                                                         
      border-radius: 2px;                                                                          
      font-family: sans-serif;                                                                     
    }                                                                                              
  .tzm-gadget label {                                                                              
      display: block;                                                                              
      margin-bottom: 10px;                                                                         
      font-weight: bold;                                                                           
  }                                                                                                
  .tzm-gadget input[type="text"], .tzm-gadget select {                                             
      width: 100%;                                                                                 
      padding: 6px;                                                                                
      margin-top: 4px;                                                                             
      box-sizing: border-box;                                                                      
  }                                                                                                
  #tzm-submit-btn {                                                                                
      background-color: #36c;                                                                      
      color: white;                                                                                
      border: none;                                                                                
      padding: 8px 12px;                                                                           
      cursor: pointer;                                                                             
      font-weight: bold;                                                                           
      margin-top: 15px;                                                                            
  }                                                                                                
  #tzm-submit-btn:hover {                                                                          
      background-color: #447ff5;                                                                   
  }                                                                                                
  #tzm-preview-area {                                                                              
      width: 100%;                                                                                 
      height: 150px;                                                                               
      margin-top: 20px;                                                                            
      font-family: monospace;                                                                      
      background-color: #eaecf0;                                                                   
  }                         
