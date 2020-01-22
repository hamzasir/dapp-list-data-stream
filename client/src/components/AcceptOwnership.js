import React, {useContext} from 'react';
import {Button} from 'semantic-ui-react';
import {StoreContext} from './StoreContext';

const AcceptOwnership = ({setProcessing}) => {
  const {contract, accounts} = useContext(StoreContext);

  const handleClick = async () => {
    setProcessing(true);
    await contract.methods
    .acceptContractOwnership()
    .send({from:accounts[0]})
    .on('receipt', () => {
      window.location.href = "/";
    })
    .on('confirmation', () => {
      window.location.href = "/";
    });
  }

  return(
    <Button onClick={handleClick}>Accept Contract Owneship</Button>
  )
}

export default AcceptOwnership;
