"use client";

// import { useState } from "react";

import { Editor } from "@monaco-editor/react";

export default function CodeEditor({ language, code, onChange }: any) {
    return (
        <Editor
            height="400px"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={onChange}
        />
    );
}
