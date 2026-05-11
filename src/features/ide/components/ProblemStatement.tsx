const ProblemStatement = ({ className, title, desc, examples }: { 
    className: string, 
    title: string, 
    desc: string,
    examples?: Array<{input: string, expected_output: string, explanation: string}>
}) => {
    return (
        <div className={className}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                    {desc}
                </p>
            </div>
            
            {examples && examples.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Examples:</h3>
                    {examples.map((example, index) => (
                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded border">
                            <div className="mb-2">
                                <span className="font-medium">Example {index + 1}:</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-medium">Input:</span> 
                                <span className="bg-gray-200 px-1 rounded">{example.input}</span>
                            </div>
                            <div className="mb-1">
                                <span className="font-medium">Output:</span> 
                                <span className="bg-gray-200 px-1 rounded">{example.expected_output}</span>
                            </div>
                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProblemStatement
