import React, { useState } from 'react';
import styles from './App.module.css';
import { TemplateEditor } from './components/TemplateEditor';
import { variables } from './models';

function App() {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div className={styles.app} >
      {showEditor ?
        <TemplateEditor arrVarNames={variables} callbackSave={() => console.log('save')} close={() => setShowEditor(false)} />
        :
        <button className={`${styles.btn} ${styles.large_btn}`} onClick={() => setShowEditor(true)}>Message Editor</button>
      }
    </div>
  );
}

export default App;
