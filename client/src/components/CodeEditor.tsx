import { useEffect, useRef, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

// Global Monaco Editor loading promise for singleton pattern
let monacoLoadingPromise: Promise<any> | null = null;

// Preload Monaco Editor as soon as the module is imported
const preloadMonaco = (() => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  if (!monacoLoadingPromise) {
    monacoLoadingPromise = loadMonacoEditor();
  }
  return monacoLoadingPromise;
})();

async function loadMonacoEditor() {
  // Return cached instance if already loaded
  if ((window as any).monaco) {
    return (window as any).monaco;
  }

  // Load Monaco loader if not already loaded
  if (!(window as any).require) {
    await new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
      script.onload = () => resolve();
      script.onerror = () => resolve(); // Don't block on script load errors
      document.head.appendChild(script);
    });
  }
  
  if (!(window as any).require) {
    throw new Error('Monaco Editor loader failed to initialize');
  }
  
  // Configure Monaco paths with optimizations
  (window as any).require.config({ 
    paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' },
    // Add cache busting and loading optimizations
    'vs/nls': {
      availableLanguages: {
        '*': 'en'
      }
    }
  });
  
  return new Promise((resolve, reject) => {
    // Load minimal Monaco modules for better performance
    (window as any).require(['vs/editor/editor.main'], 
      (monaco: any) => {
        // Cache the Monaco instance globally
        (window as any).monaco = monaco;
        resolve(monaco);
      },
      reject
    );
  });
}

export default function CodeEditor({ value, onChange, language, height = "400px" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized debounced change handler
  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 75); // Reduced from 150ms to 75ms for better responsiveness
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) return;

    // Use the preloaded Monaco instance
    preloadMonaco.then((monaco) => {
      if (editorRef.current && !monacoRef.current) {
        monacoRef.current = monaco.editor.create(editorRef.current, {
          value: value || getDefaultCode(language),
          language: getMonacoLanguage(language),
          theme: 'vs',
          fontSize: 14,
          // Enhanced performance optimizations
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          roundedSelection: false,
          cursorStyle: 'line',
          selectOnLineNumbers: true,
          renderLineHighlight: 'none',
          occurrencesHighlight: false,
          renderControlCharacters: false,
          renderWhitespace: 'none',
          folding: false,
          // Additional performance optimizations
          links: false,
          colorDecorators: false,
          codeLens: false,
          contextmenu: false,
          mouseWheelZoom: false,
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: 'off',
          tabCompletion: 'off',
          wordBasedSuggestions: 'off',
          renderValidationDecorations: 'off',
          // Disable expensive features
          hover: { enabled: false },
          matchBrackets: 'never',
          renderIndentGuides: false,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
        });

        // Optimized change handler
        monacoRef.current.onDidChangeModelContent(() => {
          const newValue = monacoRef.current.getValue();
          debouncedOnChange(newValue);
        });
      }
    }).catch((error) => {
      console.warn('Monaco Editor failed to load:', error);
      // Fallback: Create a simple textarea as backup
      if (editorRef.current) {
        const textarea = document.createElement('textarea');
        textarea.value = value || getDefaultCode(language);
        textarea.className = 'w-full h-full p-4 font-mono text-sm border border-border rounded resize-none';
        textarea.style.height = height;
        textarea.addEventListener('input', (e) => {
          debouncedOnChange((e.target as HTMLTextAreaElement).value);
        });
        editorRef.current.appendChild(textarea);
      }
    });

    return () => {
      // Clean up timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Dispose editor
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, [debouncedOnChange]);

  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      // Optimize setValue to prevent unnecessary re-renders and infinite loops
      const newValue = value || getDefaultCode(language);
      const currentValue = monacoRef.current.getValue();
      if (currentValue !== newValue) {
        // Use pushEditOperations for better performance than setValue
        const range = monacoRef.current.getModel().getFullModelRange();
        const op = { range: range, text: newValue, forceMoveMarkers: true };
        monacoRef.current.executeEdits('external', [op]);
      }
    }
  }, [value, language]);

  useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        const currentLanguage = model.getLanguageId();
        const newLanguage = getMonacoLanguage(language);
        if (currentLanguage !== newLanguage) {
          (window as any).monaco.editor.setModelLanguage(model, newLanguage);
        }
      }
      if (!value) {
        const defaultCode = getDefaultCode(language);
        const currentValue = monacoRef.current.getValue();
        if (currentValue !== defaultCode) {
          const range = monacoRef.current.getModel().getFullModelRange();
          const op = { range: range, text: defaultCode, forceMoveMarkers: true };
          monacoRef.current.executeEdits('external', [op]);
        }
      }
    }
  }, [language, value]);

  return (
    <div 
      ref={editorRef} 
      style={{ height, width: '100%' }}
      className="border border-border rounded"
      data-testid="code-editor"
    />
  );
}

function getMonacoLanguage(language: string): string {
  switch (language) {
    case 'python': return 'python';
    case 'javascript': return 'javascript';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    default: return 'plaintext';
  }
}

function getDefaultCode(language: string): string {
  switch (language) {
    case 'python':
      return `# Example: Bubble Sort Algorithm
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
sorted_array = bubble_sort(test_array.copy())
print("Sorted array:", sorted_array)`;
    
    case 'javascript':
      return `// Example: Bubble Sort Algorithm
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
const sortedArray = bubbleSort([...testArray]);
console.log("Sorted array:", sortedArray);`;
    
    case 'java':
      return `// Example: Bubble Sort Algorithm
import java.util.Arrays;

public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    
    public static void main(String[] args) {
        int[] testArray = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(testArray);
        System.out.println("Sorted array: " + Arrays.toString(testArray));
    }
}`;
    
    case 'cpp':
      return `// Example: Bubble Sort Algorithm
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> testArray = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(testArray);
    
    cout << "Sorted array: ";
    for (int x : testArray) {
        cout << x << " ";
    }
    cout << endl;
    
    return 0;
}`;
    
    default:
      return '// Enter your code here...';
  }
}