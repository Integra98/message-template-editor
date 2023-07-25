import React, { RefObject, useContext, useEffect, useState } from 'react';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { Conditions } from './Conditions';
import { ConditionType, ITextAreaTemplate, IVariable } from '../models';
import { TemplateContext } from '../TemplateContext';

interface TemplateTextAreaProps {
    focusedArea: HTMLTextAreaElement | undefined;
    conditionsCount: number;
    conditionType: ConditionType | null;
    parentAreaId: string | null | undefined;
    parentConditionId?: string | null | undefined;
    giveAreaId?: (id: string) => void
}

export function TemplateTextArea({ focusedArea, conditionsCount, conditionType, parentAreaId, parentConditionId, giveAreaId }: TemplateTextAreaProps) {
    const [secondArea, setSecondArea] = useState(false)
    const [textTemplate, setTextTemplate] = useState('')
    const [secondTextTemplate, setSecondTextTemplate] = useState('')
    const [textAreaId, setTextAreaId] = useState<string | null>(null)
    const [secondTextAreaId, setSecondTextAreaId] = useState<string | null>(null)
    let textAreaRef: RefObject<HTMLTextAreaElement> | null = null;
    let secondTextAreaRef: RefObject<HTMLTextAreaElement> | null = null;

    const {areaAdded, areaDeleted, parentAreaChanged } = useContext(TemplateContext)

    // set parentConditionId for TextArea(THEN,ELSE)
    useEffect(() => {
        if (parentConditionId && textAreaId) {
            parentAreaChanged(textAreaId, parentConditionId, true)
        }

        if (parentAreaId && textAreaId) {
            parentAreaChanged(textAreaId, parentAreaId, false)
        }
    }, [parentConditionId, parentAreaId])


    function setAreaId(areaRef: RefObject<HTMLTextAreaElement>, isSecond: boolean) {

        if (areaRef.current) {
            if (!isSecond) {
                textAreaRef = areaRef
                setTextAreaId(areaRef.current?.id)
                if (giveAreaId) {
                    giveAreaId(areaRef.current?.id)
                }
            } else {
                secondTextAreaRef = areaRef;
                setSecondTextAreaId(areaRef.current?.id)
            }
        }

        const newArea: ITextAreaTemplate = {
            textAreaId: areaRef.current?.id ? areaRef.current?.id : '',
            content: areaRef.current?.value ? areaRef.current?.value : '',
            isSecondArea: isSecond,
            firstAreaId: isSecond ? textAreaId : null,
            secondAreaId: isSecond ? null : secondTextAreaId,
            conditionType: conditionType,
            conditionVar: null,
            parentAreaId: parentAreaId,
            parentConditionId: parentConditionId
        }
        areaAdded(newArea)
    }


    useEffect(() => {
        if (focusedArea && focusedArea.id === textAreaId) {
            createCondition()
        }
    }, [conditionsCount])


    function createCondition() {
        const selectionStart = focusedArea?.selectionStart
        const selectionEnd = focusedArea?.selectionEnd
        const textAreaValue = focusedArea?.value
        setTextTemplate(textAreaValue ? textAreaValue.substring(0, selectionStart) : '')
        setSecondTextTemplate(textAreaValue ? textAreaValue.substring(Number(selectionEnd), textAreaValue.length) : '')
        setSecondArea(true)
    }

    function deleteCondition() {
        const firstEl = textAreaId ? document.getElementById(textAreaId) : null
        const secondEl = secondTextAreaId ? document.getElementById(secondTextAreaId) : null
        const textAreaValue = (firstEl?.textContent ? firstEl?.textContent : '') + (secondEl?.textContent ? secondEl?.textContent : '')
        setTextTemplate(textAreaValue)
        setSecondArea(false)
        if(textAreaId){
            areaDeleted(textAreaId)
        }
    }


    return (
        <>
            <CustomTextArea template={textTemplate} giveRef={(ref) => setAreaId(ref, false)} />

            {secondArea &&
                <>
                    <Conditions focusedArea={focusedArea} conditionsCount={conditionsCount}
                        parentAreaId={textAreaId} deleteCondition={() => deleteCondition()} />
                    <CustomTextArea template={secondTextTemplate} giveRef={(ref) => setAreaId(ref, true)} />
                </>
            }</>
    )

}