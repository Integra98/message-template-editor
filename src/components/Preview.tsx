import React, { useEffect } from 'react';
import styles from '../App.module.css';
import { IVariable } from '../models';

interface PreviewProps {
    arrVarNames: IVariable[];
    template: any;
    close: () => void
}

export function Preview({ arrVarNames, template, close }: PreviewProps) {

    let messageTemplate: string = '';

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let val = evt.target?.value;
 
    };

    function generateMessage(){
        const templateData = JSON.parse(template);
        console.log('arrVarNames', arrVarNames);
        console.log('template', template);
        console.log('templateData', templateData);
    }

    useEffect(() => {
        generateMessage()
    }, [arrVarNames, template])

    return (
        <div className={styles.preview_background}>
            <div className={`${styles.widget} ${styles.preview}`}>
                <h1 className={styles.h1}>Message Preview</h1>
                <div className={styles.message_template}>{messageTemplate}</div>

                <div className={styles.var_inputs}>
                    <div className={styles.title}>Variables:</div>

                    {arrVarNames.map(variable =>
                        <div className={styles.var_input} key={variable.name}>
                            <div className={styles.input_name}>{variable.name}</div>
                            <input className={styles.input} id={variable.name} type="text" 
                            onChange={evt => handleChange(evt)}/>
                        </div>
                    )}

                </div>

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={close}>Close</button>
                </div>

            </div>
        </div>
    )
}