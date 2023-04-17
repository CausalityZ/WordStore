import React from 'react';
import '/src/styles.css';
import '../node_modules/bulma/css/bulma.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import WordDict from './WordDict/WordDict';
// Import your other components here

const App: React.FC = () => {
  return (
    <div className="App">
        <WordDict />
    </div>
  );
};

export default App;