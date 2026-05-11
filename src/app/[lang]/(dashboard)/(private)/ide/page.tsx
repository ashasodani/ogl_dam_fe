'use client'

import { useState } from "react";

import { useDispatch, useSelector } from 'react-redux';

import { Button } from "@mui/material";

import ProblemStatement from "@/features/ide/components/ProblemStatement"
import CodeEditor from "@/features/ide/components/CodeEditor";
import XTerminal from "@/features/ide/components/Terminal";
import LangSelector from "@/features/ide/components/LangSelector";
import { authenticateJDoodle, getJDoodleOutput, getJDoodleLoading, executeJDoodleCode } from '@/store/slices/jdoodleSlice';
import type { AppDispatch } from '@/store';


const IDE = () => {
    const dispatch = useDispatch<AppDispatch>();
    const output = useSelector(getJDoodleOutput);
    const loading = useSelector(getJDoodleLoading);

    // const output = {
    //     "output": "The sum is: 15",
    //     "error": null,
    //     "statusCode": 200,
    //     "memory": "22716",
    //     "cpuTime": "0.07",
    //     "compilationStatus": null,
    //     "projectKey": null,
    //     "isExecutionSuccess": true,
    //     "isCompiled": true
    // }
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("// write your code here");

    return (
        <div className="flex h-dvh">
            {/* Left Problem Statement */}
            <ProblemStatement
                className={'basis-1/3 flex-1 p-5'}
                title={'Two Sum Problem'}
                desc={'Given an array of integers... find two numbers such that they add up to target.'}
            />

            {/* Right IDE */}
            <div className="basis-2/3 flex flex-col p-5 border-black border-l-4 border-double gap-4">
                <div className="flex gap-3 mb-2 justify-between">
                    <LangSelector value={language} onChange={setLanguage} />
                    <Button
                        variant='contained'
                        className="h-8"

                        // onClick={() => dispatch(authenticateJDoodle())}
                        onClick={() => {
                            const payload = {
                                script: code,
                                language: language,
                                stdin: ""
                            };
                            dispatch(executeJDoodleCode(payload))
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Running...' : 'Run'}
                    </Button>
                </div>
                <CodeEditor language={language} code={code} onChange={setCode} />
                <XTerminal output={output} />
            </div>
        </div>
    )
}

export default IDE
