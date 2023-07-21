import React, { useEffect, useId, useRef, useState } from 'react';
import styles from '../App.module.css';
import useAutosizeTextArea from './CustomTextArea/AutosizeTextArea';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { TemplateTextArea } from './TemplateTextArea';
import { IVariable } from './Variables';

interface ConditionsProps {
    focusedArea: HTMLTextAreaElement | undefined;
    conditionsCount: number;
    selectedVar: IVariable | undefined;
    deleteCondition: () => void
}

export function Conditions({ focusedArea, conditionsCount, selectedVar, deleteCondition }: ConditionsProps) {

    useEffect(() => {
        console.log('!!! Conditions selectedVar', selectedVar);
    }, [selectedVar])

    return (
        <div className={styles.conditions}>

            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>IF</span>
                    <button className={styles.delete_btn} onClick={() => deleteCondition()}>Delete</button>
                </div>
                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} selectedVar={selectedVar}/>
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>THEN</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} selectedVar={selectedVar}/>
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>ELSE</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} selectedVar={selectedVar}/>
                </div>
            </div>

        </div>
    )

}