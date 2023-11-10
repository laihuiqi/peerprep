import "./CodeEditor.css"
import Editor from "@monaco-editor/react";
import React from "react";

const CodeEditor = ({code, setCode, language, isReadOnly}) => {
    const OriginalResizeObserver = window.ResizeObserver;

    // Monaco Editor Resize Fix (https://github.com/microsoft/vscode/issues/183324#issuecomment-1575484617)
    window.ResizeObserver = function (callback) {
        const wrappedCallback = (entries, observer) => {
            window.requestAnimationFrame(() => {
                callback(entries, observer);
            });
        };

        return new OriginalResizeObserver(wrappedCallback);
    };

    for (let staticMethod in OriginalResizeObserver) {
        if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
            window.ResizeObserver[staticMethod] = OriginalResizeObserver[staticMethod];
        }
    }

    return (
        <div className="code-editor">
            <Editor
                language={language}
                theme="vs-light"
                value={code}
                onChange={e => {setCode(code)}}
                options={{
                    inlineSuggest: true,
                    fontSize: "16px",
                    formatOnType: true,
                    minimap: { enabled: false },
                    readOnly: isReadOnly 
                }}
            />
        </div>
    );
};

export default CodeEditor;