import React, {useState} from 'react';
import styles from '../App.module.css';
import { TemplateTextArea } from './TemplateTextArea';
import { ConditionType} from '../models';


interface ConditionsProps {
    focusedArea: HTMLTextAreaElement | undefined;
    conditionsCount: number;
    parentAreaId: string | null;
    deleteCondition: () => void
}

export function Conditions({ focusedArea, conditionsCount,parentAreaId, deleteCondition }: ConditionsProps) {

    const [parentConditionId, setParentConditionId] = useState('');

    return (
        <div className={styles.conditions}>

            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>IF</span>
                    <button className={styles.delete_btn} onClick={() => deleteCondition()}>Delete</button>
                </div>
                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} 
                     conditionType={ConditionType.if} 
                    parentAreaId={parentAreaId} giveAreaId={(id) => {setParentConditionId(id)}}/>
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>THEN</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} 
                     conditionType={ConditionType.then} 
                    parentAreaId={parentAreaId} parentConditionId={parentConditionId}/>
                </div>
            </div>
            <div className={styles.condition}>
                <div className={styles.condition_title}>
                    <span className={styles.condition_text}>ELSE</span>
                </div>

                <div className={styles.condition_textarea}>
                    <TemplateTextArea focusedArea={focusedArea} conditionsCount ={conditionsCount} 
                     conditionType={ConditionType.else} 
                    parentAreaId={parentAreaId} parentConditionId={parentConditionId}/>
                </div>
            </div>

        </div>
    )

}