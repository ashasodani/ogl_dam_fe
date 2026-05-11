"use client";

import { ListItemText, MenuItem, Select } from "@mui/material";

export default function LangSelector({ value, onChange }: any) {
 
    const languages = [{
        label: "JavaScript",
        value: "javascript"
    }, {
        label: "Python",
        value: "python"
    }, {
        label: "Java",
        value: "java"
    }, {
        label: "C++",
        value: "cpp"
    }, {
        label: "SQL",
        value: "sql"
    }];

    return (
        <div className="h-8 w-auto flex justify-center items-center gap-3">
            <div className="">Select Language:</div>
            <Select
                labelId='demo-multiple-radio-label'
                id='demo-multiple-checkbox'
                value={value}
                className="h-full"
                onChange={e => {
                    console.log(e.target.value)
                    onChange(e.target.value) // trigger your API fetch
                }}
            >
                {languages?.map(lang => (
                    <MenuItem key={lang.value} value={lang.value}>
                        {/* <Checkbox checked={field.value?.includes(technology.id)} /> */}
                        <ListItemText primary={lang.label} className="capitalize" />
                    </MenuItem>
                ))}
            </Select>
        </div>

    );
}
