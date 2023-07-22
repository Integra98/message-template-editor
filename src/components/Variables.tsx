import React, { useRef, useState } from 'react';
import styles from '../App.module.css';
import { IVariable } from '../models';

interface VariablesProps{
    variables: IVariable[];
    selected: (variable: IVariable) => void
}

export function Variables({variables, selected}: VariablesProps){

    return (
        <div className={styles.editor_variables}>
             {variables.map(variable => {
        return (
            <div className={styles.variable} key={variable.name} onClick={() => {selected(variable)}}>{variable.name}</div>
        );
      })}
        </div>
    )
}