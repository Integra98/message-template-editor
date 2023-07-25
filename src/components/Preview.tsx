import React, { useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { ConditionType, ITextAreaTemplate, IVariable, variables } from '../models';

interface PreviewProps {
    arrVarNames: IVariable[];
    template: any;
    close: () => void
}

const templateDataset: ITextAreaTemplate[] = [];

export function Preview({ arrVarNames, template, close }: PreviewProps) {

    const messageTextRef = useRef<HTMLDivElement>(null);
    const [varArray, setVarArray] = useState<IVariable[]>([]);
    const varContent: Map<string, string> = new Map();

    //Hanle change of variable's input
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let value = evt.target.value;
        varContent.set(evt.target.id, value)
        if (messageTextRef.current) {

            //Пересобираем текст сообщиения при изменении Variables
            if (templateDataset) {
                messageTextRef.current.innerHTML = generateMessage(templateDataset)
            }

            //замена variables на значения из inputs
            var varNode = messageTextRef.current?.getElementsByClassName(evt.target.id)
            if (varNode) {
                for (let i = 0; i < varNode.length; i++) {
                    const node = varNode.item(i);

                    if (node) {
                        replaceVarContent(evt.target.id, node.textContent, value)
                        node.textContent = value;
                    }
                }
            }
        }
    };

    //Convert variable:string to variable:HTML Element
    function replaceVariables(content: string): string {
        variables.forEach(variable => {
            if (content.includes(`{${variable.name}}`)) {
                content = content.replace(`{${variable.name}}`, `<span class=${variable.name}>{${variable.name}}</span>`)
            }
        });
        return content;
    }

    function replaceVarContent(varId: string, oldValue: string|null, newValue: string){
        const dataForUpdate = templateDataset.filter(data => data.content.includes(`class=${varId}`));
        dataForUpdate.forEach(data => {
            const newContent = data.content.replace(
                `<span class=${varId}>${oldValue}</span>`, 
                `<span class=${varId}>${newValue}</span>`)

            const indx = templateDataset.findIndex(d => d === data)
            templateDataset[indx].content = newContent
        })
    }


    function generateMessage(templateData: ITextAreaTemplate[]): string {
        var templateContent = '';
        const firstArea = templateData.find(area => !area.conditionType && !area.isSecondArea);
        const secondArea = templateData.find(area => !area.conditionType && area.isSecondArea);

        if (firstArea) {
            templateContent = templateContent + firstArea?.content + "<br/>"
            const conditionArea = checkConditionAvailable(templateData, firstArea?.textAreaId)
            if (conditionArea) {
                //Если есть Condition то генерируем текcт для него
                templateContent = templateContent + generateMessageWithCondition(templateData, firstArea)
            } else {
                templateContent = templateContent + (secondArea?.content ? secondArea?.content : '')
            }

        }
        return templateContent
    }

    function generateMessageWithCondition(templateData: ITextAreaTemplate[], parentArea: ITextAreaTemplate): string {
        const conditionAreas = templateData.filter(area => area.conditionType && area.parentAreaId === parentArea?.textAreaId);
        const conditionIf = conditionAreas.find(c => c.conditionType === ConditionType.if)
        var contentFromCondition = '';
        if (conditionIf) {
            //Проверка наличия условия для IF area
             const conditionforThisArea = checkConditionAvailable(templateData, conditionIf?.textAreaId)
             if (conditionforThisArea) {
                 contentFromCondition += generateMessageWithCondition(templateData, conditionIf)
                 console.log('conditionforThisArea', contentFromCondition);
             }

            const condition = conditionIf.conditionVar ? varContent.get(conditionIf.conditionVar) : null

            //Проверка наличия значения Variable
            if (condition) {
                const thenPart = conditionAreas.find(c => c.conditionType === ConditionType.then)
                if (thenPart) {
                    contentFromCondition = contentFromCondition + thenPart?.content + "<br/>"
                    console.log('thenPart', contentFromCondition);

                    //Проверка наличия условия для THEN area
                    const conditionforThisArea = checkConditionAvailable(templateData, thenPart?.textAreaId)
                    if (conditionforThisArea) {
                        contentFromCondition += generateMessageWithCondition(templateData, thenPart)
                    }
                }

            } else {
                const elsePart = conditionAreas.find(c => c.conditionType === ConditionType.else)
                if (elsePart) {
                    contentFromCondition = contentFromCondition + elsePart?.content + "<br/>"
                    console.log('elsePart', contentFromCondition);

                    //Проверка наличия условия для ELSE area
                    const conditionforThisArea = checkConditionAvailable(templateData, elsePart?.textAreaId)
                    if (conditionforThisArea) {
                        contentFromCondition += generateMessageWithCondition(templateData, elsePart)
                    }
                }
            }

            const secondArea = templateData.find(area => area.isSecondArea && area.firstAreaId == parentArea?.textAreaId);
            contentFromCondition = contentFromCondition + secondArea?.content + "<br/>"

        }

        return contentFromCondition
    }

    function checkConditionAvailable(templateData: ITextAreaTemplate[], parentAreaId: string): ITextAreaTemplate | undefined {
        return templateData.find(area => area.conditionType && area.parentAreaId === parentAreaId);
    }

    const firstRenderRef = useRef(true);
    useEffect(() => {
        const firstRender = firstRenderRef.current;

        if (firstRender) {
            firstRenderRef.current = false;

            //Получение  template и arrVarNames(без дубликатов) из родительского компонента при 1 рендере
            if (template && messageTextRef.current) {
                JSON.parse(template).map((el:ITextAreaTemplate) => templateDataset.push(el))
                if (templateDataset) {
                    templateDataset?.forEach(data => data.content = replaceVariables(data.content))
                    messageTextRef.current.innerHTML = generateMessage(templateDataset)
                }
            }

            const newVars: IVariable[] = [];
            if (arrVarNames.length > 0) {
                arrVarNames.forEach((variable) => {
                    if (!newVars.includes(variable)) {
                        newVars.push(variable);
                        varContent.set(variable.name, '')
                    }
                });
                setVarArray(newVars);
            }
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