import "./CodeEditor.css"
import Editor from "@monaco-editor/react";
import React from "react";
import { getUserId } from "../../User/UserState";

const CodeEditor = ({code, setCode, language, isReadOnly, socket}) => {
    const OriginalResizeObserver = window.ResizeObserver;
    var originalCode = code;
    originalCode.sort((a, b) => {
        return a.line - b.line;
    })
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

    // socket.emit()

    const toCode = (collabInput) => {
        collabInput.sort((a, b) => {
            return a.line - b.line;
        })
        return collabInput.map(item => item.code).join("\n");
    }

    const toCollabInput = (code) => {
        return code.split('\n').map((line, index) => {
            if (line != originalCode[index].code) {
                return {line: index + 1, code: line, lastModifier: getUserId()}
            } else {
                return {line: index + 1, code: line, lastModifier: originalCode[index].lastModifier}
            }
        })
    }

    return (
        <div className="code-editor">
            <Editor
                language={language.toLowerCase()}
                theme="vs-light"
                value={toCode(code)}
                onChange={(newValue, e) => {setCode(toCollabInput(newValue))}}
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
