import React, { useState, useEffect } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Web3 from 'web3';
import Sciot from './contracts/Sciot';
import { StoreContext } from './components/StoreContext';
import ListDataStream from './components/ListDataStream';
import Add from './components/Add';
import Admin from './components/Admin';
import ListSource from './components/ListSource';

function App() {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState();
  const [contract, setContract] = useState();
  const [error, setError] = useState();
  const [activeItem, setActiveItem] = useState();

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  }

  useEffect(() => {
    var pathname = window.location.pathname;
    pathname = pathname.replace('/','');
    pathname = (pathname === '') ? 'list' : pathname;
    setActiveItem(pathname);
    const init = async () => {
      try {
        await window.ethereum.enable();
        const _web3 = new Web3(window.ethereum);
        setWeb3(_web3);
        const _accounts = await _web3.eth.getAccounts();
        setAccounts(_accounts)
        const networkId = await _web3.eth.net.getId();
        const deployedNetwork = Sciot.networks[networkId];
        const _contract = new _web3.eth.Contract(
          Sciot.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(_contract);
      } catch {
        setError('Metamask extension is required to use the Dapp.');
      }
    };
    init();
  }, []);

  if (web3 && accounts && contract) {
    return (
      <Container>
        <StoreContext.Provider value={{web3, accounts, contract}}>
          <BrowserRouter>
            <Menu pointing secondary>
              <Menu.Item
                as={Link}
                to='/'
                name='list'
                active={activeItem === 'list'}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to='/add'
                name='add'
                active={activeItem === 'add'}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to='/sources'
                name='sources'
                active={activeItem === 'sources'}
                onClick={handleItemClick}
              />
              <Menu.Item
                as={Link}
                to='/admin'
                name='admin'
                active={activeItem === 'admin'}
                onClick={handleItemClick}
              />
            </Menu>
            <Route path="/" exact component={ListDataStream} />
            <Route path="/add" component={Add} />
            <Route path="/sources" component={ListSource} />
            <Route path="/admin" component={Admin} />
          </BrowserRouter>
        </StoreContext.Provider>
      </Container>
    );
  }
  else if (error) {
    return (
      <div>
        {error} <a href="https://metamask.io">https://metamask.io</a>
      </div>
    )
  }
  else {
    return (
      <div className="App">Loading...</div>
    )
  }
}

export default App;
