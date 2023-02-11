import { useEffect, useRef, useState } from 'react';
import './App.css';
import { SlotMachine } from '@lucky-canvas/react';
import Reward from 'react-rewards';
import { CornerPiece } from './CornerPiece';
import Swal from 'sweetalert2';

const initialState = {
  blocks: [
    { padding: '10px', background: '#3e0707', borderRadius: '10px' },
    { padding: '10px', background: '#3e0707', borderRadius: '20px' },
    { padding: '10px', background: '#510f0f', borderRadius: '10px' },
    { padding: '20px 0px', background: '#3e0707', borderRadius: '25px' },
  ],
  prizes: [],
  slots: [{ order: [], direction: -1 }],
  defaultConfig: {
    mode: 'horizontal',
    rowSpacing: '10px',
    colSpacing: '10px',
    decelerationTime: 10000,
  },
};

const App = () => {
  const [state, _setState] = useState(initialState);
  const slotMachine = useRef(null);
  const reward = useRef(null);
  const [name, setName] = useState('');
  const [lastWon, setLastWon] = useState(-1);
  const [show1, setShow1] = useState(true);
  const [rerender, setRerender] = useState(true);

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

  window.test = slotMachine.current;

  const spin = () => {
    const slots = state.slots[0].order;
    const index = slots[(Math.random() * slots.length) >> 0];
    slotMachine.current.stop(index);
    setLastWon(index);
    console.log(index, state.prizes[index]);
  };

  const addPrize = (event) => {
    event.preventDefault();
    const prize = {
      name: String(Math.random()),
      fonts: [{ text: name, top: '43%' }],
      background: '#F2CF76',
      borderRadius: '25px',
    };
    let index = state.prizes.length;
    state.prizes.push(prize);
    state.slots[0].order.push(index);
    console.log(prize, state.prizes, state.slots[0].order);
    setRerender(!rerender);
  };

  const toggle1 = () => {
    setShow1(!show1);
  };

  useEffect(() => {
    document.addEventListener('keyup', function (event) {
      if (event.key === '+') {
        start(); // Roll the spinner
      } else if (event.key === '0') {
        spin(); // Choose a winner
      }
    });
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
            elementCount: 80,
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
              console.log(prize, 123);
              setTimeout(() => reward.current.rewardMe(), 100);
            }}
          ></SlotMachine>
        </div>
        <div className={`formWrapper ${show1 ? 'hidden' : ''}`}>
          <div className="buttonWrapper">
            <button onClick={start}>Start</button>
            <button onClick={spin}>Stop</button>
          </div>
          <hr />
          <form onSubmit={addPrize} className="form">
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
          <div className="names">
            {state.prizes.map((prize, index) => {
              const name = prize.fonts[0].text;
              const count = state.slots[0].order.filter(
                (i) => i === index,
              ).length;
              return (
                <div className="info" key={index}>
                  <p id={prize.name}>
                    {name} - {count}
                  </p>
                  <div className="btnwrappers">
                    <button
                      className="btnadd"
                      onClick={() => {
                        const index = state.prizes
                          .map(({ name }) => name)
                          .indexOf(prize.name);
                        state.slots[0].order.push(index);
                        setRerender(!rerender);
                      }}
                    >
                      +
                    </button>
                    <button
                      className="btnminus"
                      onClick={() => {
                        const index = state.prizes
                          .map(({ name }) => name)
                          .indexOf(prize.name);
                        const pos = state.slots[0].order.indexOf(index);
                        if (pos >= 0) {
                          state.slots[0].order.splice(pos, 1);
                        }
                        setRerender(!rerender);
                      }}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <img src="./pick.png" alt="Scroll pick" className="pick" />
      <CornerPiece className="corner topleft" />
      <CornerPiece className="corner topright" />
      <CornerPiece className="corner bottomleft" />
      <CornerPiece className="corner bottomright" />
      <div className="topButton">
        <button onClick={() => toggle1()}></button>
      </div>
    </>
  );
};

export default App;
