const axios = require('axios').default;

let x = axios.create({
    "baseURL": "http://localhost:2918",
    "headers": { "Content-Type": "application/json" }
});

async function test() {
    let identity = await x.post("/identities", { "purpose": "issueNew" })
        .then(rep => rep.data);

    let datetime = Date.now();
    let purpose = "newHeartbeat";

    let heartbeatObject = {
        "datetime": datetime,
        "purpose": purpose,
        "identity": identity
    };

    await x.post("/heartbeats", heartbeatObject)
        .then(rep => console.log(rep.data))
        .catch(e => console.log(e));
}

test();