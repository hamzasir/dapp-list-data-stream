import React, { useContext, useState,  useEffect } from 'react';
import { Table } from 'semantic-ui-react'
import { StoreContext } from './StoreContext';

const ListDataStream = () => {
  const {web3, contract} = useContext(StoreContext);
  const [items, setItems] = useState([]);

  const abortController = new AbortController();
  const signal = abortController.signal;

  useEffect(() => {
    const init = async () => {
      const res = await contract.methods.getDataStreams().call();
      if(res == "") return false;
      const list = res.toString().split(',').map(x => web3.utils.toUtf8(x));
      setItems(list);
    };
    init({signal: signal});
    return function cleanup() {
      abortController.abort();
    }
  }, []);

  return (
    <Table celled padded>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Data Streams</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {items.map(item => (
        <Table.Row key={item}>
          <Table.Cell>
            {item}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
    </Table>
  )
}

export default ListDataStream;
