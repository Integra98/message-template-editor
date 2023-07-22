import React, { useState } from 'react';
import styles from '../App.module.css';
import { IVariable } from '../models';

interface PreviewProps {
    arrVarNames: IVariable[];
    template: any;
    close: ()=> void
}

export function Preview({ arrVarNames, template, close }: PreviewProps) {

    return (
        <div className={styles.preview_background}>
            <div className={`${styles.widget} ${styles.preview}`}>
                <h1 className={styles.h1}>Message Preview</h1>
                <div className={styles.message_template}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt consectetur, rem aperiam quam explicabo autem iure nisi harum vero maxime illum? Fugit similique ullam iure nesciunt quibusdam consequatur velit atque.</div>
                
                <div className={styles.var_inputs}>
                <div className={styles.title}>Variables:</div>

                <div className={styles.var_input}>
                    <div className={styles.input_name}>123</div>
                    <input className={styles.input} type="text" />
                </div>
                <div className={styles.var_input}>
                    <div className={styles.input_name}>123</div>
                    <input className={styles.input} type="text" />
                </div>
                <div className={styles.var_input}>
                    <div className={styles.input_name}>123</div>
                    <input className={styles.input} type="text" />
                </div>
                <div className={styles.var_input}>
                    <div className={styles.input_name}>123</div>
                    <input className={styles.input} type="text" />
                </div>

                </div>

                <div className={styles.widget_footer}>
                    <button className={styles.btn} onClick={close}>Close</button>
                </div>

            </div>
        </div>
    )
}