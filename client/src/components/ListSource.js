import React, { useState, useContext } from 'react';
import { Segment, Button, Form, Table, Icon } from 'semantic-ui-react';
import { StoreContext } from './StoreContext';

const ListSource = () => {
  const {web3, contract, accounts} = useContext(StoreContext);
  const [dataStream, setDataStream] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);
    const tmp = [];
    await contract.methods
      .getDataStreamSourcesAddresses(web3.utils.utf8ToHex(dataStream))
      .call()
      .then(async addresses => {
        for(let i in addresses){
          const status = await contract.methods
            .getDataStreamSourceStatus(web3.utils.utf8ToHex(dataStream), addresses[i])
            .call();
          tmp.push({address:addresses[i], status});
        }
      });
    setData(tmp);
    setReady(true);
    setProcessing(false);
  }

  const handleClick = async (address, status) => {
    setProcessing(true);
    if(status){
      await contract.methods
        .disableDataStreamSource(web3.utils.utf8ToHex(dataStream), address)
        .send({from:accounts[0]})
        .on('receipt', () => {
          window.location.href = "/";
        })
        .on('confirmation', () => {
          window.location.href = "/";
        });
    } else {
      await contract.methods
        .enableDataStreamSource(web3.utils.utf8ToHex(dataStream), address)
        .send({from:accounts[0]})
        .on('receipt', () => {
          window.location.href = "/";
        })
        .on('confirmation', () => {
          window.location.href = "/";
        });
    }
  }

  if(processing){
    return(
      <div>Processing...</div>
    )
  }
  else if(ready){
    return(
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Addresses</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(item => (
            <Table.Row key={item.address}>
              <Table.Cell>
                {item.address}
              </Table.Cell>
              <Table.Cell>
                <Icon
                  color={item.status ? 'green' : 'red'}
                  name={item.status ? 'unlock' : 'lock'}
                  onClick={() => {handleClick(item.address, item.status)}}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }
  else {
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
          <Button type='submit'>Get</Button>
        </Form>
      </Segment>
    )
  }
}

export default ListSource;
