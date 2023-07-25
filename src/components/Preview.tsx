import React, { RefObject, useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { ConditionType, ITextAreaTemplate, IVariable, variables } from '../models';
import { Conditions } from './Conditions';

interface PreviewProps {
    arrVarNames: IVariable[];
    template: any;
    close: () => void
}

export function Preview({ arrVarNames, template, close }: PreviewProps) {

    const messageTextRef = useRef<HTMLDivElement>(null);
    const [varArray, setVarArray] = useState<IVariable[]>([]);
    const varContent: Map<string, string> = new Map();

    //Hanle change of variable's input
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let value = evt.target.value;
        var varNode = messageTextRef.current?.getElementsByClassName(evt.target.id)
        if (varNode) {
            varContent.set(evt.target.id, value)
            for (let i = 0; i < varNode.length; i++) {
                const node = varNode.item(i);
                console.log('i node', node);

                if (node) {
                    node.textContent = value;
                }
            }
        }

    };

    //Convert variable:string to variable:HTML Element
    function replaceVariables(content: string): string {
        var newContent = '';
        variables.forEach(variable => {
            if (content.includes(`{${variable.name}}`)) {
                newContent = content.replace(`{${variable.name}}`, `<span class=${variable.name}>{${variable.name}}</span>`)
                console.log('newContent:', newContent);
            }
        });
        return newContent;
    }

    function generateMessage(): string {
        const templateData: ITextAreaTemplate[] = JSON.parse(template);
        var templateContent = '';

        console.log('arrVarNames', arrVarNames);
        console.log('templateData', templateData);

        const firstArea = templateData.find(area => !area.conditionType && !area.isSecondArea);
        const secondArea = templateData.find(area => !area.conditionType && area.isSecondArea);
        if (firstArea) {
            templateContent += firstArea?.content + "<br/>" 
            const conditionArea = checkConditionAvailable(templateData, firstArea?.textAreaId)
            // if (conditionArea) {
            //     //Если есть Condition то генерируем тект для него
            //     templateContent += generateMessageWithCondition(templateData, firstArea)
            // } 
            templateContent +=  (secondArea?.content ? secondArea?.content : '')
            
        }

        // console.log('templateContent', templateContent);
        return replaceVariables(templateContent);
    }

    function generateMessageWithCondition(templateData: ITextAreaTemplate[], parentArea: ITextAreaTemplate): string {
        const conditionAreas = templateData.filter(area => area.conditionType && area.parentAreaId === parentArea?.textAreaId);
        console.log('PREVIEW condition', conditionAreas);
        const conditionIf = conditionAreas.find(c => c.conditionType === ConditionType.if)
        var contentFromCondition = '';
        if (conditionIf) {
            const condition = conditionIf.conditionVar ? varContent.get(conditionIf.conditionVar) : null
            //Проверка наличия значения Variable
            if (condition) {
                const thenPart = conditionAreas.find(c => c.conditionType === ConditionType.then)
                if (thenPart) {
                    contentFromCondition += thenPart?.content + "<br/>"

                    //Проверка наличия условия для THEN area
                    const conditionforThisArea = checkConditionAvailable(templateData, thenPart?.textAreaId)
                    if (conditionforThisArea) {
                        contentFromCondition += generateMessageWithCondition(templateData, thenPart)
                    }
                }

            } else {
                const elsePart = conditionAreas.find(c => c.conditionType === ConditionType.else)
                if (elsePart) {
                    contentFromCondition += elsePart?.content + "<br/>"

                    //Проверка наличия условия для ELSE area
                    const conditionforThisArea = checkConditionAvailable(templateData, elsePart?.textAreaId)
                    if (conditionforThisArea) {
                        contentFromCondition += generateMessageWithCondition(templateData, elsePart)
                    }
                }
            }
            //Проверка наличия условия для IF area
            const conditionforThisArea = checkConditionAvailable(templateData, conditionIf?.textAreaId)
            if (conditionforThisArea) {
                contentFromCondition += generateMessageWithCondition(templateData, conditionIf)
            }
        }

        return replaceVariables(contentFromCondition)
    }

    function checkConditionAvailable(templateData: ITextAreaTemplate[], parentAreaId: string): ITextAreaTemplate | undefined {
        return templateData.find(area => area.conditionType && area.parentAreaId === parentAreaId);
    }

    useEffect(() => {
        //Получение  template и arrVarNames из родительского компонента
        if (template && messageTextRef.current) {
            messageTextRef.current.innerHTML = generateMessage()
        }

        const newVars: IVariable[] = [];
        if (arrVarNames.length > 0) {
            arrVarNames.forEach((variable) => {
                if (!newVars.includes(variable)) {
                    newVars.push(variable);
                    varContent.set(variable.name, '')
                }
            });
            setVarArray(newVars)
        }


    }, [arrVarNames, template])

    return (
        <div className={styles.preview_background}>
            <div className={`${styles.widget} ${styles.preview}`}>
                <h1 className={styles.h1}>Message Preview</h1>
                <div className={styles.message_template} ref={messageTextRef}></div>

                {varArray.length > 0 &&

                    <div className={styles.var_inputs}>
                        <div className={styles.title}>Variables:</div>

                        {varArray.map(variable =>
                            <div className={styles.var_input} key={variable.name}>
                                <div className={styles.input_name}>{variable.name}</div>
                                <input className={styles.input} id={variable.name} type="text"
                                    onChange={evt => handleChange(evt)} />
                            </div>
                        )}

                    </div>
                }

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={close}>Close</button>
                </div>

            </div>
        </div>
    )
}