import React, { useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import useAutosizeTextArea from './CustomTextArea/AutosizeTextArea';
import { Conditions } from './Conditions';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { TemplateTextArea } from './TemplateTextArea';
import { Preview } from './Preview';
import { IVariable } from '../models';
import { Variables } from './Variables';


interface TemplateEditorProps {
    arrVarNames: IVariable[];
    template?: string;
    callbackSave: () => void;
    close: () => void;
}

export function TemplateEditor({ arrVarNames, template, callbackSave, close }: TemplateEditorProps) {

    const [focusElement, setFocusElement] = useState<HTMLTextAreaElement>()

    const handleFocusChange = (event: React.SyntheticEvent) => {
        let target = event.target as HTMLElement;
        if (target.tagName == 'TEXTAREA') {
            setFocusElement(target as HTMLTextAreaElement)
        }

    }

    const [elWithCondition, setElWithCondition] = useState<HTMLTextAreaElement>()
    const [conditionsCount, setConditionsCount] = useState(0);

    function createCondition() {
        if (focusElement) {
            setConditionsCount(prev => prev + 1)
            setElWithCondition(focusElement)
        }
    }

    const [selectedVar, setSelectedVar] = useState<IVariable>()

    function insertVal(variable: IVariable) {
        setSelectedVar(variable)
        setElWithCondition(focusElement)
    }

    const [showPreview, setShowPreview] = useState(false)

    return (
        <div className={styles.widgets}>
            <div className={`${styles.widget} ${styles.template_editor}`} onClick={handleFocusChange}>
                <h1 className={styles.h1}>Message Template Editor</h1>
                <div className={styles.editor_variables}>
                    <Variables variables={arrVarNames} selected={(v) => insertVal(v)} />
                </div>
                <button className={`${styles.btn} ${styles.add_btn}`} onClick={() => createCondition()}>
                    {`Click to add: IF-THEN-ELSE`}
                </button>

                <TemplateTextArea focusedArea={elWithCondition} conditionsCount={conditionsCount} selectedVar={selectedVar} />

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={() => setShowPreview(true)}> Preview</button>
                    <button className={styles.btn}>Save</button>
                    <button className={styles.btn} onClick={close}>Close</button>
                </div>
            </div>

            {showPreview && <Preview arrVarNames={[]} template={''} close={() => setShowPreview(false)}/>}
        </div>
    )
}