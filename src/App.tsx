import * as esBuild from 'esbuild-wasm';
import React, { useEffect, useRef } from 'react';
import './App.css';
import { useState } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg.plugin';
import { fetchPlugin } from './plugins/fetch-plugins';
import CodeEditor from './components/code-editor';

function App() {
    const [input, setInput] = useState<string | undefined>('');
    const [code] = useState('');
    const iframe = useRef<any>();

    useEffect(() => {
        // This ugly code is to avoid calling initialize() more than once
        try {
            try {
                esBuild.build({});
            } catch (error) {
                if (error instanceof Error && error.message.includes('initialize')) {
                    esBuild.initialize({
                        worker: true,
                        wasmURL: 'https://unpkg.com/esbuild-wasm@0.15.5/esbuild.wasm',
                    });
                } else {
                    //throw error;
                }
            }
        } catch (error) {

        }
    }, []);

    const onClick = async () => {
        const result = await esBuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });

        iframe.current.srcdoc = html;

        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
    }

    const html = `
    <html> 
        <head></head>
        <body>
            <div id="root"></div>
            <script>
            window.addEventListener('message', (event) => {
                console.log('data------------', event.data);
                const root = document.querySelector('#root');
                try{
                    eval(event.data);
                } catch(err) {
                    root.innerHTML = '<div style="color: red;"><h4>Runtime Error: </h4>' + err + '</div>';
                    consol.error(err);
                }
            }, false);
            </script>
        </body>
        
    </html>
    `;

    return (
        <div>
            <CodeEditor
                onChange={(value) => setInput(value)}
                initialValue='const a = 1;'
            />
            <textarea
                value={input}
                onChange={e => setInput(e.target.value)}>
            </textarea>
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <pre>{code}</pre>
            <iframe ref={iframe} sandbox='allow-scripts' srcDoc={html} title='code-preview' />
        </div>
    );
}

export default App;
