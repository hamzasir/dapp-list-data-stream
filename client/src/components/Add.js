import React, { useState, useContext } from 'react';
import { StoreContext } from './StoreContext';
import AddDataStream from './AddDataStream';
import AddSource from './AddSource';

const Add = () => {
  const {web3, contract, accounts} = useContext(StoreContext);
  const [processing, setProcessing] = useState(false);

  if(processing) {
    return(
      <div>Processing...</div>
    );
  } else {
    return(
      <>
        <AddDataStream setProcessing={setProcessing} />
        <AddSource setProcessing={setProcessing} />
      </>
    )
  }
}

export default Add;
