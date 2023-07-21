import React, { useEffect, useId, useRef, useState } from 'react';
import useAutosizeTextArea from './AutosizeTextArea';
import './CustomTextArea.css'

interface CustomTextAreaProps{
    template?: string;
    giveId: (id: string) => void;
}

export function CustomTextArea({template, giveId}: CustomTextAreaProps) {
    // Autosize TextArea
    const [textAreaValue, setTextAreaValue] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const textAreaId = useId();

    useAutosizeTextArea(textAreaRef.current, textAreaValue);

    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setTextAreaValue(val);

    };

    // give Id to Parent
    useEffect(() => {
        giveId(textAreaId)
    });

    useEffect(() => {
        if(template){
            setTextAreaValue(template)
        }
    }, [template]);
    
    return (
        <>
            <textarea
                id={textAreaId}
                className='textarea'
                onChange={evt => handleChange(evt)}
                ref={textAreaRef}
                rows={1}
                value={textAreaValue}
            />
            
        </>
    )
}