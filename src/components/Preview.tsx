import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { ConditionType, ITextAreaTemplate, IVariable, variables } from '../models';
import { TemplateContext } from '../TemplateContext';

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
    const { setGeneratedMessage } = useContext(TemplateContext)
    const firstRenderRef = useRef(true);

    useEffect(() => {
        const firstRender = firstRenderRef.current;

        if (firstRender) {
            firstRenderRef.current = false;

            //Получение  template и arrVarNames(без дубликатов) из родительского компонента при 1 рендере
            if (template && messageTextRef.current) {
                JSON.parse(template).map((el: ITextAreaTemplate) => templateDataset.push(el))
                if (templateDataset) {
                    templateDataset?.forEach(data => data.content = replaceVariables(data.content))
                    messageTextRef.current.innerHTML = generateMessage()
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

    //Hanle change of variable's input
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let value = evt.target.value;
        varContent.set(evt.target.id, value)
        if (messageTextRef.current) {

            //Пересобираем текст сообщиения при изменении Variables
            if (templateDataset) {
                messageTextRef.current.innerHTML = generateMessage()
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

    function replaceVarContent(varId: string, oldValue: string | null, newValue: string) {
        const dataForUpdate = templateDataset.filter(data => data.content.includes(`class=${varId}`));
        dataForUpdate.forEach(data => {
            const newContent = data.content.replace(
                `<span class=${varId}>${oldValue}</span>`,
                `<span class=${varId}>${newValue}</span>`)

            const indx = templateDataset.findIndex(d => d === data)
            templateDataset[indx].content = newContent
        })
    }


    function generateMessage(): string {
        var templateContent = '';
        const firstArea = templateDataset.find(area => !area.conditionType && !area.isSecondArea);
        const secondArea = templateDataset.find(area => !area.conditionType && area.isSecondArea);

        if (firstArea) {
            templateContent = templateContent + (firstArea?.content ? firstArea?.content + '<br/>' : '')
            const conditionArea = checkConditionAvailable(firstArea?.textAreaId)
            if (conditionArea) {
                //Если есть Condition то генерируем текcт для него
                templateContent = templateContent + generateMessageWithCondition(firstArea)
            } else {
                templateContent = templateContent + (secondArea?.content ? secondArea?.content : '')
            }

        }
        return templateContent
    }

    function generateMessageWithCondition(parentArea: ITextAreaTemplate): string {
        const conditionAreas = templateDataset.filter(area => area.conditionType && area.parentAreaId === parentArea?.textAreaId);
        const conditionIf = conditionAreas.find(c => c.conditionType === ConditionType.if)
        var contentFromCondition = '';
        if (conditionIf) {
            //Проверка наличия условия для IF area
            const conditionforIfArea = checkConditionAvailable(conditionIf?.textAreaId)
            if (conditionforIfArea) {
                contentFromCondition += generateMessageWithCondition(conditionIf)
            }

            const condition = conditionIf.conditionVar ? varContent.get(conditionIf.conditionVar) : null
            const thenPart = conditionAreas.find(c => c.conditionType === ConditionType.then)
            const elsePart = conditionAreas.find(c => c.conditionType === ConditionType.else)

            //Проверка наличия значения Variable
            if (condition) {
                contentFromCondition = contentFromCondition + (thenPart?.content ? thenPart?.content + '<br/> ' : '')
            } else {
                contentFromCondition = contentFromCondition + (elsePart?.content ? elsePart?.content + '<br/>' : '')
            }

            if (thenPart) {
                //Проверка наличия условия для THEN area
                const conditionforThenArea = checkConditionAvailable(thenPart?.textAreaId)
                if (conditionforThenArea) {
                    contentFromCondition += generateMessageWithCondition(thenPart)
                }
            }

            if (elsePart) {
                //Проверка наличия условия для ELSE area
                const conditionforElseArea = checkConditionAvailable(elsePart?.textAreaId)
                if (conditionforElseArea) {
                    contentFromCondition += generateMessageWithCondition(elsePart)
                }
            }

            const secondArea = templateDataset.find(area => area.isSecondArea && area.firstAreaId == parentArea?.textAreaId);
            contentFromCondition = contentFromCondition + (secondArea?.content ? secondArea?.content + '<br/>' : '')

        }

        return contentFromCondition
    }

    function checkConditionAvailable(parentAreaId: string): ITextAreaTemplate | undefined {
        return templateDataset.find(area => area.conditionType && area.parentAreaId === parentAreaId);
    }


    function closePreview() {
        templateDataset.splice(0,templateDataset.length)
        setGeneratedMessage(messageTextRef.current?.textContent ? messageTextRef.current.textContent : '')
        close()
    }


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
                                <input className={styles.input} id={variable.name} type='text'
                                    onChange={evt => handleChange(evt)} />
                            </div>
                        )}

                    </div>
                }

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={closePreview}>Close</button>
                </div>

            </div>
        </div>
    )
}