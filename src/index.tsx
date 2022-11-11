import { useState, useEffect, useRef, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import * as esbuild from 'esbuild-wasm';

const container = document.getElementById('root');
const root = createRoot(container!); // We need to add ! because we are using typeScript.

const App = () => {
  // State
  const [input, setInput] = useState('');
  const [code, setCode] = useState(''); 

  // Ref
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm' // This is to access web assembly binary from the public directory.
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const clickHandler = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });

    setCode(result.code);
  };

  return (
    <Fragment>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={clickHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </Fragment>
  );
};

root.render(<App />);