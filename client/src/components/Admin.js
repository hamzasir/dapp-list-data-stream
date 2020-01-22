import React, { useState, useContext, useEffect } from 'react';
import {Divider} from 'semantic-ui-react';
import { StoreContext } from './StoreContext';
import Pause from './Pause';
import TransferOwnership from './TransferOwnership';
import AcceptOwnership from './AcceptOwnership';

const Admin = () => {
  const {contract} = useContext(StoreContext);
  const [paused, setPaused] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const init = async () => {
      const res = await contract.methods.paused().call();
      setPaused(res);
    };
    init();
  }, []);

  if(processing) {
    return(
      <div>Processing...</div>
    )
  } else {
    return(
      <div>
        <Pause paused={paused} setProcessing={setProcessing}/>
        <Divider/>
        <TransferOwnership setProcessing={setProcessing}/>
        <Divider/>
        <AcceptOwnership setProcessing={setProcessing}/>
      </div>
    )
  }
}

export default Admin;
