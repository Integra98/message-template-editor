import React, { useState } from 'react';
import styles from './App.module.css';
import { TemplateEditor } from './components/TemplateEditor';
import { IVariable } from './components/Variables';

function App() {
  const [start, setStart] = useState(false)

  const variables: IVariable[] =
    [{ name: 'firstName' },
    { name: 'lastName' },
    { name: 'company' },
    { name: 'position' }]

  return (
    <div className={styles.app} >
      {start ?
        <TemplateEditor arrVarNames={variables} callbackSave={() => console.log('save')} />
        :
        <button className={`${styles.btn} ${styles.large_btn}`} onClick={() => setStart(prev => prev = true)}>Message Editor</button>
      }
    </div>
  );
}

export default App;
