import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { TemplateEditor } from './components/TemplateEditor';
import { variables } from './models';
import { TemplateProvider } from './TemplateContext';

function App() {
  const [showEditor, setShowEditor] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState<string>('')
  const firstRenderRef = useRef(true);

  async function saveTemplate(data: string) {
    localStorage.setItem('template', JSON.stringify(data));
  }

  useEffect(() => {
    const firstRender = firstRenderRef.current;
    if (firstRender) {
      const template = localStorage.getItem('template')
      if (template) {
        setMessageTemplate(template)
      }
    }
  });


  return (
    <TemplateProvider>
      <div className={styles.app} >
        {showEditor ?
          <TemplateEditor arrVarNames={variables} template={messageTemplate} callbackSave={(data) => saveTemplate(data)} close={() => setShowEditor(false)} />
          :
          <button className={`${styles.btn} ${styles.large_btn}`} onClick={() => setShowEditor(true)}>Message Editor</button>
        }
      </div>
    </TemplateProvider>

  )
}

export default App;
