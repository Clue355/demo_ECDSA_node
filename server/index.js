const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
    "0x1": { amount: 100, publicKey: "f10e72f7a8272d3bacd560f93be9ac8abfd4f308" },
    "0x2": { amount: 50, publicKey: "200a9264a5e65a859e153dd2f43e0edc818655e6" },
    "0x3": { amount: 75, publicKey: "5a5422582ca0eb3dac46404951c6fd1183a1786c" },
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address].amount || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { signature, address, msgHash, recoveryBit, recipient, amount } = req.body;

    if (!signature) {
        res.status(400).send({ message: "Unauthorized!" });
    }

    // convert signature to Uint8Array
    let signatureUint8 = objectToUint8Array(signature);
    let msgHashUint8 = objectToUint8Array(msgHash);

    // recover public key from signature
    let pk = secp.recoverPublicKey(msgHashUint8, signatureUint8, recoveryBit);

    // get address from recovered public key and provided public key
    let hexSig = toHex(getAddress(pk));

    // check if the provided public key matches the recovered public key
    if (balances[address].publicKey !== hexSig) {
        res.status(400).send({ message: "Unauthorized!" });
    }

    // find the object key by using the public key
    let sender = findKeyByPublicKey(balances, hexSig);
    // console.log("sender:", sender);

    // check if sender exists
    if (sender === null) {
        balances[hexSig] = { amount: 0, publicKey: `${hexSig}` };
        sender = hexSig;
    }

    // check if a balance exists for the recipient
    setInitialBalance(recipient);

    // check if sender has enough funds
    if (balances[sender].amount < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender].amount -= amount;
        balances[recipient].amount += amount;
        res.send({ balance: balances[sender].amount });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address].amount) {
        balances[address].amount = 0;
    }
}

function objectToUint8Array(obj) {
    const length = Object.keys(obj).length;
    const uint8Array = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        uint8Array[i] = obj[i];
    }

    return uint8Array;
}

function getAddress(publicKey) {
    const firstByte = publicKey[0];
    const hash = keccak256(publicKey.slice(1, publicKey.length));
    return hash.slice(-20, hash.length);
}

function findKeyByPublicKey(obj, targetPublicKey) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key].publicKey === targetPublicKey) {
            return key;
        }
    }
    return null;
}
