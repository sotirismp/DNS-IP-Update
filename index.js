require("dotenv").config();
const axios = require("axios");
const fetch = require("cross-fetch");

const IP_CHECK_INTERVAL = 1000 * 60 * 5; // interval to check the ip

const headers = {
  "X-Auth-Email": process.env.xAuthEmail,
  "X-Auth-Key": process.env.xAuthKey,
  "Content-Type": "application/json",
};

async function sleep(t) {
  return new Promise((r) => setTimeout(r, t));
}

(async () => {
  console.log("Started");
  while (true) {
    try {
      let resp = await axios.get("https://api.ipify.org");
      if (resp.status && resp.status === 200) {
        const myIp = resp.data;
        resp = await axios.get(
          `https://api.cloudflare.com/client/v4/zones/${process.env.zoneId}/dns_records/${process.env.recordId}`,
          { headers }
        );
        if (resp.status && resp.status === 200) {
          const cloudFlareIp = resp.data.result.content;
          if (myIp !== cloudFlareIp) {
            resp = await axios.put(
              `https://api.cloudflare.com/client/v4/zones/${process.env.zoneId}/dns_records/${process.env.recordId}`,
              {
                type: "A",
                name: process.env.domain,
                content: myIp,
                ttl: 3600,
                proxied: true,
              },
              { headers }
            );
            resp.data.success
              ? console.log(`IP changed successfully to: ${myIp}`)
              : console.log(`Something went wrong changing the IP`);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }

    await sleep(IP_CHECK_INTERVAL);
  }
})();
