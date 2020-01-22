import React, {useState, useContext} from 'react';
import {Button, Form} from 'semantic-ui-react';
import {StoreContext} from './StoreContext';

const TransferOwnership = ({setProcessing}) => {
  const {contract, accounts} = useContext(StoreContext);
  const [newOwner, setNewOwner] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);
    await contract.methods
    .transferContractOwnership(newOwner)
    .send({from:accounts[0]})
    .on('receipt', () => {
      window.location.href = "/";
    })
    .on('confirmation', () => {
      window.location.href = "/";
    });
  }

  return(
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>New Owner Address</label>
        <input
          type='text'
          value={newOwner}
          onChange={e => setNewOwner(e.target.value)}
      />
      </Form.Field>
      <Button type='submit'>Submit</Button>
    </Form>
  )
}

export default TransferOwnership;
