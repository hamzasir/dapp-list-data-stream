import React, { useState, useContext } from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import { StoreContext } from './StoreContext';

const AddSource = ({setProcessing}) => {
  const {web3, contract, accounts} = useContext(StoreContext);
  const [dataStream, setDataStream] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);
    await contract.methods
      .addDataStreamSource(web3.utils.utf8ToHex(dataStream), address)
      .send({ from: accounts[0] })
      .on('receipt', () => {
        window.location.href = "/";
      })
      .on('confirmation', () => {
        window.location.href = "/";
      });
  }

  return(
    <Segment>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Data Stream</label>
          <input
            type="text"
            value={dataStream}
            onChange={e => setDataStream(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </Segment>
  )
}

export default AddSource;
