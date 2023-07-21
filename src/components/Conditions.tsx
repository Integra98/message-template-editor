import React, { useEffect, useId, useRef, useState } from 'react';
import styles from '../App.module.css';
import useAutosizeTextArea from './CustomTextArea/AutosizeTextArea';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { TemplateTextArea } from './TemplateTextArea';

interface ConditionsProps {
    conditionAdded: HTMLTextAreaElement | undefined;
    deleteCondition: () => void
}

export function Conditions({ conditionAdded, deleteCondition }: ConditionsProps) {

    return (
        <div className={styles.conditions}>

            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>IF</span>
                    <button className={styles.delete_btn} onClick={() => deleteCondition()}>Delete</button>
                </div>
                <div className={styles.condition_textarea}>
                    <TemplateTextArea conditionAdded={conditionAdded} />
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>THEN</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea conditionAdded={conditionAdded} />
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>ELSE</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea conditionAdded={conditionAdded} />
                </div>
            </div>

        </div>
    )

}