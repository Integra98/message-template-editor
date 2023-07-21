import React, { useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { Conditions } from './Conditions';

interface TemplateTextAreaProps{
    conditionAdded: HTMLTextAreaElement | undefined;
}

export function TemplateTextArea({conditionAdded}: TemplateTextAreaProps) {
    const [secondArea, setSecondArea] = useState(false)
    const [textTemplate, setTextTemplate] = useState('')
    const [secondTextTemplate, setSecondTextTemplate] = useState('')
    const [textAreaId, setTextAreaId] = useState('')
    const [secondTextAreaId, setSecondTextAreaId] = useState('')

    useEffect(() => {
        if(conditionAdded && conditionAdded.id === textAreaId){
            createCondition()
        }
    }, [conditionAdded])


    function createCondition() {
        const selectionStart = conditionAdded?.selectionStart
        const selectionEnd = conditionAdded?.selectionEnd
        const textAreaValue = conditionAdded?.value
        setTextTemplate(textAreaValue ? textAreaValue.substring(0, selectionStart) : '')
        setSecondTextTemplate(textAreaValue ? textAreaValue.substring(Number(selectionEnd), textAreaValue.length) : '')
        setSecondArea(true)
    }

    function deleteCondition(){
        const firstEl = document.getElementById(textAreaId)
        const secondEl = document.getElementById(secondTextAreaId)
        const textAreaValue = (firstEl?.textContent ? firstEl?.textContent : '') + (secondEl?.textContent ? secondEl?.textContent : '')
        setTextTemplate(textAreaValue)
        setSecondArea(false)
    }


    return (
        <>
            <CustomTextArea template={textTemplate} giveId={(res) => setTextAreaId(res)}/>

            {secondArea &&
                <>
                    <Conditions conditionAdded={conditionAdded} deleteCondition={() => deleteCondition()}/>
                    <CustomTextArea template={secondTextTemplate} giveId={(res) => setSecondTextAreaId(res)}/>
                </>
            }</>
    )

}