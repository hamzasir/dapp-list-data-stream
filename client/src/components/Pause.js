import React, {useContext} from 'react';
import { Button, Segment} from 'semantic-ui-react';
import {StoreContext} from './StoreContext';

const Pause = ({paused, setProcessing}) => {
  const {contract, accounts} = useContext(StoreContext);

  const handlePaused = async (e) => {
    setProcessing(true);
    if(!paused) {
      await contract.methods
      .pause()
      .send({ from: accounts[0] })
      .on('receipt', () => {
        window.location.href = "/";
      })
      .on('confirmation', () => {
        window.location.href = "/";
      });
    } else {
      await contract.methods
      .unPause()
      .send({ from: accounts[0] })
      .on('receipt', () => {
        window.location.href = "/";
      })
      .on('confirmation', () => {
        window.location.href = "/";
      });
    }
  }

  return(
    <>
      <Segment inverted color={paused ? 'orange' : 'olive'}>
        Contract is <b>{paused ? 'paused' : 'unpaused'}</b>
      </Segment>
      <Button onClick={handlePaused}>{paused ? 'Unpause' : 'Pause'}</Button>
    </>
  )
}

export default Pause;
