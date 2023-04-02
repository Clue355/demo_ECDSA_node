function Info({addresses}) {
    return (
      <div className="container info">
        <h1>Wallet Data</h1>
        <p>Use the below data for the demo</p>
        <div>{`Address: 0x1 Balance:${addresses["0x1"]} Private Key:48f864b688df479bbd64accf9b3232cecaef8d4b82dc4726acd01eb4b96953fc`}</div>
        <div>{`Address: 0x2 Balance:${addresses["0x2"]} Private Key:9d35d795e3351e16e69283ad7bd878df34083ff8a591f7d2d5c0804b659ed8a7`}</div>
        <div>{`Address: 0x3 Balance:${addresses["0x3"]} Private Key:98c688669474ae8755f1bbe767e16a458a8c8117297aaf32f52e73c81b2f4e4a`}</div>
      </div>
    );
  }
  
  export default Info;

