import { useEffect, useRef, useState } from 'react';
import './App.css';
import { SlotMachine } from '@lucky-canvas/react';
import Reward from 'react-rewards';
import { CornerPiece } from './CornerPiece';

const initialState = {
  blocks: [
    { padding: '10px', background: '#E83939', borderRadius: '10px' },
    { padding: '10px', background: '#F15454', borderRadius: '20px' },
    { padding: '10px', background: '#E86A6A', borderRadius: '40px' },
    { padding: '20px 0px', background: '#FEA0A0', borderRadius: '25px' },
  ],
  prizes: [],
  slots: [{ order: [], direction: -1 }],
  defaultConfig: { mode: 'horizontal', rowSpacing: '10px', colSpacing: '10px' },
};

const App = () => {
  const [state, setState] = useState(initialState);
  const slotMachine = useRef(null);
  const reward = useRef(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [lastWon, setLastWon] = useState(-1);
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(false);

  const start = () => {
    // Delete order from slot lastwin
    if (lastWon > -1) {
      for (let i = 0; i < state.slots[0].order.length; i++) {
        if (state.slots[0].order[i] == lastWon)
          state.slots[0].order.splice(i, 1);
      }
    }
    console.log(state.slots[0].order, lastWon);
    slotMachine.current.play();
  };
  const spin = () => {
    const slots = state.slots[0].order;
    const index = slots[(Math.random() * slots.length) >> 0];
    slotMachine.current.stop(index);
    setTimeout(() => reward.current.rewardMe(), 2550);
    setLastWon(index);
    console.log(index, state.prizes[index].name);
  };
  const addPrize = (event) => {
    event.preventDefault();
    const prize = {
      name: id,
      fonts: [{ text: name, top: '43%' }],
      background: '#F2CF76',
      borderRadius: '25px',
    };
    const dup = state.prizes.map(({ name }) => name).indexOf(id);
    let index = state.prizes.length;
    if (dup == -1) {
      state.prizes.push(prize);
    } else {
      index = dup;
    }
    state.slots[0].order.push(index);
    console.log(prize, state.prizes, state.slots[0].order);
  };
  const toggle1 = () => {
    setShow1(!show1);
    console.log('a', show1);
  };
  const toggle2 = () => {
    setShow2(!show2);
    console.log('b', show2);
  };
  useEffect(() => {
    document.addEventListener('keyup', function (event) {
      if (event.key === '+') {
        start();
      } else if (event.key === '-') {
        spin();
      }
    });
    return;
    for (let i = 1; i <= 30; i++) {
      const prize = {
        name: i + '',
        fonts: [{ text: 'bob', top: '43%' }],
        background: '#F2CF76',
        borderRadius: '25px',
      };
      state.prizes.push(prize);
    }
  }, []);
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
        <div className="formWrapper" hidden={show1}>
          <div className="buttonWrapper">
            <button onClick={start}>Start</button>
            <button onClick={spin}>Stop</button>
          </div>
          <form onSubmit={addPrize} className="form">
            <label>
              <input
                type="text"
                value={id}
                placeholder="ID"
                onChange={(ev) => setId(ev.target.value)}
              />
            </label>
            <label>
              <input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </label>
            <input type="submit" value="Add lottery" />
          </form>
        </div>
      </div>
      <div
        className="formWrapper down"
        style={{ display: show2 ? 'grid' : 'none' }}
      >
        {state.prizes.map((prize, index) => {
          const name = prize.fonts[0].text;
          const count = state.slots[0].order.filter((i) => i === index).length;
          return (
            <div className="info" key={index}>
              <p>
                ({prize.name}) {name} - {count}
              </p>
            </div>
          );
        })}
      </div>
      <img src="./pick.png" alt="Scroll pick" className="pick" />
      <CornerPiece className="corner topleft" />
      <CornerPiece className="corner topright" />
      <CornerPiece className="corner bottomleft" />
      <CornerPiece className="corner bottomright" />
      <div className="topButton">
        <button onClick={() => toggle1()}></button>
        <button onClick={() => toggle2()}></button>
      </div>
    </>
  );
};

export default App;
