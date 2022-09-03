import './code-editor.css'
import MonacoEditor from '@monaco-editor/react';
import { useState } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
    initialValue: string;
    onChange(value?: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {

    const [value, setValue] = useState<string | undefined>('');

    const onFormatClick = () => {
        const unformattedValue = value;

        if (unformattedValue) {
            const formatted = prettier.format(unformattedValue,
                {
                    parser: 'babel',
                    plugins: [parser],
                    useTabs: false,
                    semi: true,
                    singleQuote: true
                }).replace(/\n$/, '');

            setValue(formatted);
        }
    }

    return (
        <div className='editor-wrapper' >
            <button
                className='button button-format is-primary is-small'
                onClick={onFormatClick}>Format</button>
            <MonacoEditor
                onChange={(e) => {
                    setValue(e);
                    onChange(value);
                }}
                value={value}
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 20,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2
                }}
                theme="vs-dark"
                height="500px"
                language="javascript"
            />
        </div>
    )
}

export default CodeEditor;