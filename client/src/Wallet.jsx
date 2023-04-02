import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, setLoading, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function setPK(evt) {
    const pk = evt.target.value;
    setPrivateKey(pk);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        address
        <input placeholder="Type an address..." value={address} onChange={onChange}></input>
      </label>
      <label>
        PrivateKey
        <input placeholder="Type an address..." value={privateKey} onChange={setPK}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
