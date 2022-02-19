import { useRef, useState } from 'react';
import './App.css';
import { SlotMachine } from '@lucky-canvas/react';
import Reward from 'react-rewards';

const initialState = {
  blocks: [
    { padding: '10px', background: '#617df2', borderRadius: '10px' },
    { padding: '10px', background: '#869cfa', borderRadius: '20px' },
    { padding: '10px', background: '#afc8ff', borderRadius: '40px' },
    { padding: '20px 0px', background: '#e9e8fe', borderRadius: '25px' },
  ],
  prizes: [
    {
      fonts: [{ text: 'Jonny', top: '43%' }],
      background: '#b8c5f2',
      borderRadius: '25px',
    },
    {
      fonts: [{ text: 'Kelvin', top: '43%' }],
      background: '#b8c5f2',
      borderRadius: '25px',
    },
    {
      fonts: [{ text: 'Jimmy', top: '43%' }],
      background: '#b8c5f2',
      borderRadius: '25px',
    },
    {
      fonts: [{ text: 'Eline', top: '43%' }],
      background: '#b8c5f2',
      borderRadius: '25px',
    },
  ],
  slots: [{ order: [0, 1, 0, 2, 3], direction: -1 }],
  defaultConfig: { mode: 'horizontal', rowSpacing: '10px', colSpacing: '10px' },
};

const App = () => {
  const [state, setState] = useState(initialState);
  const slotMachine = useRef(null);
  const reward = useRef(null);
  const spin = () => {
    const slots = state.slots[0].order;
    const index = slots[(Math.random() * slots.length) >> 0];
    slotMachine.current.stop(index);
    setTimeout(() => reward.current.rewardMe(), 2550);
  };
  return (
    <>
      <div className="reward">
        <Reward
          ref={reward}
          type="confetti"
          config={{
            lifetime: 200,
            angle: 90,
            decay: 0.94,
            spread: 90,
            startVelocity: 35,
            elementCount: 60,
            elementSize: 8,
            zIndex: 10,
            springAnimation: true,
          }}
        >
          <button onClick={reward?.current?.fetchSomeData}></button>
        </Reward>
      </div>
      <div className="App">
        <div className="slot">
          <SlotMachine
            ref={slotMachine}
            height="250px"
            blocks={state.blocks}
            prizes={state.prizes}
            slots={state.slots}
            defaultConfig={state.defaultConfig}
            onEnd={(prize) => {
              console.log(prize);
            }}
          ></SlotMachine>
        </div>
        <button onClick={() => slotMachine.current.play()}>Start</button>
        <button onClick={spin}>Stop</button>
      </div>
    </>
  );
};

export default App;
