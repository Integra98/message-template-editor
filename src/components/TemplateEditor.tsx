import React, { useContext, useEffect, useState } from 'react';
import styles from '../App.module.css';
import { TemplateTextArea } from './TemplateTextArea';
import { Preview } from './Preview';
import { IVariable } from '../models';
import { Variables } from './Variables';
import { TemplateContext } from '../TemplateContext';

interface TemplateEditorProps {
    arrVarNames: IVariable[];
    template: string;
    callbackSave: (template: string) => void;
    close: () => void;
}

export function TemplateEditor({ arrVarNames, template, callbackSave, close }: TemplateEditorProps) {

    const { selectedVars, textAreaTemp, setGeneratedMessage, varSelected} = useContext(TemplateContext)
    const [focusElement, setFocusElement] = useState<HTMLTextAreaElement>()
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        setGeneratedMessage(JSON.stringify(template))
      }, [template]);
      

    function setScreenSize() {
        const editor = document.getElementById('editor')
        const height = editor?.scrollHeight ? editor?.scrollHeight + 318 : editor?.scrollHeight
        const widgets = document.getElementById('widgets')
        if (widgets) {
            widgets.setAttribute('style', `height:${height}px;`)
        }
    }

    const handleFocusChange = (event: React.SyntheticEvent) => {
        let target = event.target as HTMLElement;
        if (target.tagName === 'TEXTAREA') {
            setFocusElement(target as HTMLTextAreaElement)
        }
    }

    const [elWithCondition, setElWithCondition] = useState<HTMLTextAreaElement>()
    const [conditionsCount, setConditionsCount] = useState(0);

    function createCondition() {
        if (focusElement) {
            // setSelectedVar(undefined)
            setConditionsCount(prev => prev + 1)
            setElWithCondition(focusElement)
            setScreenSize()
        }
    }

    function insertVal(variable: IVariable) {
        if(focusElement){
            varSelected(focusElement, variable)
            setElWithCondition(focusElement)
        }
    }

    function saveTemplate(){
        if(textAreaTemp){
            callbackSave(textAreaTemp)
            close()
        }
        // если нужно сохранить сгенерированный вариант сообщения то передать в функцию нужно generatedMessage вместо textAreaTemp
    }

    return (
        <div id='widgets' className={styles.widgets}>
            <div id='editor' className={`${styles.widget} ${styles.template_editor}`} onClick={handleFocusChange}>
                <h1 className={styles.h1}>Message Template Editor</h1>
                <div className={styles.editor_variables}>
                    <Variables variables={arrVarNames} selected={(v) => insertVal(v)} />
                </div>
                <button className={`${styles.btn} ${styles.add_btn}`} onClick={() => createCondition()}>
                    {`Click to add: IF-THEN-ELSE`}
                </button>

                <TemplateTextArea focusedArea={elWithCondition} conditionsCount={conditionsCount}
                    conditionType={null} parentAreaId={null} />

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={() => setShowPreview(true)}> Preview</button>
                    <button className={styles.btn} onClick={() => saveTemplate()}>Save</button>
                    <button className={styles.btn} onClick={close}>Close</button>
                </div>
            </div>

            {showPreview && <Preview arrVarNames={selectedVars} template={textAreaTemp} close={() => setShowPreview(false)} />}
        </div>
    )
}