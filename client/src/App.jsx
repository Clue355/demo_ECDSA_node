import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState, useEffect } from "react";
import Info from "./addressInfo";
import server from "./server";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [getInfo, setGetInfo] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [addresses, setAddresses] = useState({
    "0x1": 0,
    "0x2": 0,
    "0x3": 0,
  });

  useEffect(() => {
    const newAddresses = {...addresses}
    getNewInfo(newAddresses).then(() => {
      setAddresses(newAddresses)
    }
    )
  }, [getInfo]);

  function handleBool() {
    setGetInfo((getInfo) => !getInfo);
  }

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={address} handleBool={handleBool} privateKey={privateKey}/>
      <Info addresses={addresses}/>
    </div>
  );
}

export default App;

async function getNewInfo(addresses){
  for (const [key, value] of Object.entries(addresses)) {
      const {
          data: { balance },
        } = await server.get(`balance/${key}`);
        addresses[key] = balance
  }
}