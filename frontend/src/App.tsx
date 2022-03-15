import React from 'react';
import {Button} from './components/Button';

function App() {
  return (
    <div>
      <h1 className="margin">🧙 Gource Wizard ✨</h1>

      <div className="flex h-screen items-center justify-center flex-col pb-20">
        <p className="margin text-center text-5xl">
          Welcome. Everything is fine.
        </p>
        <Button className="m-5" title="Github Magic ✨"></Button>
      </div>
    </div>
  );
}

export default App;
