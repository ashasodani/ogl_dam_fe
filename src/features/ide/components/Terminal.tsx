"use client";
import { useEffect, useRef, useState } from "react";

import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function XTerminal({ output }: any) {
    const termRef = useRef<any>(null);
    const terminalRef = useRef<Terminal | null>(null);

    const [memory, setMemory] = useState("");
    const [cpuTime, setCpuTime] = useState("");
    const [out, setOut] = useState("Run your code...");



    useEffect(() => {
        if (output) {
            const { output: outResp, memory: mem, cpuTime: cTime, error } = output;

            const result = outResp || error
            if (result) {
                console.log(result)
                setMemory(mem);
                setCpuTime(cTime);

                setOut(result || "Nothing to print....")

                // terminalRef.current.write(result || "Nothing to print....");
            }
        }
    }, [output]);

    return (<div>
        <div className="font-bold">Output:</div>
        {cpuTime && memory && <div className="flex gap-5 text-sm bg-black text-white border border-b-white">
            <div>Time: <span className="text-yellow-400">{cpuTime}</span> sec </div>
            <div>Mem: <span className="text-yellow-400">{memory}</span> kB</div>
        </div>}
        <textarea
            name="output"
            id="output"
            className="w-full p-2 text-[14px] font-mono border border-borderPrimary bg-black resize-none focus:outline-none text-white"
            cols={30}
            rows={8}
            value={out}
            readOnly
            spellCheck={false}
        />
        {/* <div ref={termRef} className='!h-20 bg-black' /> */}
    </div>);
}
