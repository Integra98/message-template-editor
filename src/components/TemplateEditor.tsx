import React, { useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { IVariable, Variables } from './Variables';
import useAutosizeTextArea from './CustomTextArea/AutosizeTextArea';
import { Conditions } from './Conditions';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { TemplateTextArea } from './TemplateTextArea';


interface TemplateEditorProps {
    arrVarNames: IVariable[];
    template?: string;
    callbackSave: () => void;
}

export function TemplateEditor({ arrVarNames, template, callbackSave }: TemplateEditorProps) {

    const [focusElement, setFocusElement] = useState<HTMLTextAreaElement>()

    const handleFocusChange = (event: React.SyntheticEvent) => {
        let target = event.target as HTMLElement;
        if (target.tagName == 'TEXTAREA') {
            setFocusElement(target as HTMLTextAreaElement)
        }

    }

    const [elWithCondition, setElWithCondition] = useState<HTMLTextAreaElement>()

    function createCondition() {
        if (focusElement) {
            // If elWithCondition did not change
            if (elWithCondition == focusElement) {
                const emptyArea = document.createElement("textarea");
                emptyArea.id = '0'
                setElWithCondition(emptyArea)
            } else {
                setElWithCondition(focusElement)
            }

        }
    }

    // If elWithCondition is emptyArea we need to set focusElement
    useEffect(() => {
        if(elWithCondition?.id == '0'){
            setElWithCondition(focusElement)
        }
      }, [elWithCondition]);

    return (
        <div className={`${styles.widget} ${styles.template_editor}`} onClick={handleFocusChange}>
            <h1 className={styles.h1}>Message Template Editor</h1>
            <div className={styles.editor_variables}>
                <Variables variables={arrVarNames} selected={() => console.log('selected')} />
            </div>
            <button className={`${styles.btn} ${styles.add_btn}`} onClick={() => createCondition()}>
                {`Click to add: IF-THEN-ELSE`}
            </button>

            <TemplateTextArea conditionAdded={elWithCondition} />

            <div className={styles.widget_footer}>
                <button className={styles.btn}> Preview</button>
                <button className={styles.btn}>Save</button>
                <button className={styles.btn}>Close</button>
            </div>
        </div>
    )
}