# DNS-IP-Update

The program checks every X minutes if your IP is changed from the cloudflare's registered IP to a specific domain you provide to the program

#### .ENV File

```diff
xAuthEmail = cloudflare email
xAuthKey =   cloudflare API key
domain = domain name
zoneId = domain's zone ID
recordId = ID for the specific A record
```

#### Installation

From terminal you should be in the same folder of the project. Type the following command:

```sh
npm install
```

After all dependencies have been installed then type:

```sh
node index.js
```

by default the program checks every 5 minutes YOUR IP and cloudflare's registered IP
