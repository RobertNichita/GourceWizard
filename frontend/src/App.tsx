import React from 'react';
import {Button} from './components/Button';
import {useNavigate} from 'react-router-dom';
import {AppBanner} from './components/navigation/AppBanner';

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <AppBanner></AppBanner>

      <div className="flex h-screen items-center justify-center flex-col">
        <p className="margin text-center text-5xl">
          Welcome. Everything is fine.
        </p>
        <Button className="m-5" title="Github Magic ✨"></Button>

        <Button
          title="Wizard Library 📖"
          onClick={() => {
            navigate('/library');
          }}
        ></Button>
      </div>
    </div>
  );
}

export default App;
