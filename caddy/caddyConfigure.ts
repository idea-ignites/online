const axios = require('axios');
const fs = require('fs');

export class CaddyConfigure {

    private caddyAPIEndPoint = "http://localhost:2019";
    private routesTable: any;

    public setRoutesTable(routesTable: any) {
        this.routesTable = routesTable;
    }

    public getRoutesTable() {
        return this.routesTable;
    }

    public req() {
        let instance = axios.create({
            "baseURL": this.caddyAPIEndPoint,
            "headers": { "Content-Type": "application/json" }
        });

        return instance;
    }

    public async isCaddyRunning(): Promise<boolean> {
        let result = await this.req().get("/config/")
            .then(response => {
                if ( response.status >= 100 && response.status < 400 ) {
                    return true;
                }
            })
            .catch(error => {
                return false;
            });

        return result;
    }

    public async isThereHTTPServer(): Promise<boolean|string> {
        let result = await this.req().get("/config/")
            .then(response => {
                if (! response.data) {
                    return false;
                }
                else {
                    let servers = response.data.apps.http.servers;
                    return servers;
                }
            }).then(data => {
                for (let serverEntry in data) {
                    let listens = data[serverEntry].listen;
                    if (listens.includes(":80") || listens.includes(":443")) {
                        return serverEntry;
                    }
                }
                return false;
            }).catch(error => {
                console.log(error);
                return false;
            });

        return result;
    }

    public async isRoutesConfigured() {
        let result = await this.req().get("/config")
            .then(response => response.data)
            .catch(error => {
                console.log(error);
                return false;
            })
        
        
        if (!result) {
            return false;
        }

        let servers = result.apps.http.servers;
        for (let serverEntry in servers) {
            let server = servers[serverEntry];
            let routes = server.routes;
            for (let route of routes) {
                if (route?.group === 'linksServices') {
                    return true;
                }
            }
        }

        return false;
    }

    public async appendsRoutesToCaddy(serverEntry, routes) {
        let result = await this .req()
            .post("/config/apps/http/servers/"+serverEntry+"/routes/...", routes)
            .then(response => {
                if (response.status >= 100 && response.status < 400) {
                    return true;
                }
            })
            .catch(error => {
                console.log(error);
                return false;
            });
        
        return result;
    }

    private getLocalConfiguration() {
        try {
            let data = JSON.parse(fs.readFileSync(__dirname + "/.." + "/configuration.json"));
            console.log(`data: \n ${data}`);
            return data;
        }
        catch (error) {
            console.log(error);
            return {};
        }
    }

    private getServerName() {
        console.log('getServerName');
        let envServerName = process.env.LINKS_SERVER_NAME;
        let configurationFileServerName = this.getLocalConfiguration().serverName;
        let defaultServerName = 'localhost';

        let serverName = envServerName || configurationFileServerName || defaultServerName;
        return serverName;
    }


    public getRoutes() {

        let serverName = this.getServerName();
        let routesTable = this.getRoutesTable();


        let routes = [];
        routes.push({
            "group": "onlineServices",
            "match": [{"host": [serverName]}],
            "handle": [{
                "handler": "file_server",
                "root": __dirname + "/.." + "/frontend",
                "index_names": ["index.html"],
                "pass_thru": true
            }]
        });

        for (let routeRule of routesTable) {
            routes.push({
                "group": "onlineServicesReverseProxy",
                "match": [
                    {
                        "path": routeRule?.from,
                        "host": [serverName]
                    }
                ],
                "handle": [{
                    "handler": "reverse_proxy",
                    "upstreams": [{"dial": routeRule?.to}]
                }]
            });
        }

        return routes;
    }


    public async putAHTTPServerToCaddy() {

        let server = {
            "listen": [":80", ":443"],
            "routes": this.getRoutes()
        };

        let result = await this.req().put("/config/apps/http/servers/linksServer", server)
            .then(response => {
                if ( response.status >= 100 && response.status < 400 ) {
                    console.log('server created.')
                    return true;
                }
                else {
                    console.log('server didn\'t create');
                    return false;
                }
            }).catch(error => {
                console.log(error);
                return false;
            })

        return result;
    }

    public async configure() {
        let isCaddyRunningCheck = await this.isCaddyRunning();
        if (!isCaddyRunningCheck) {
            console.log('caddy is not started yet, please start it.');
            process.exit(1);
        }

        let httpEntry = await this.isThereHTTPServer();
        console.log(`httpEntry ${JSON.stringify(httpEntry)}`);
        if (!httpEntry) {
            console.log('found no http server in caddy, try to made one.');
            let putAServerToCaddyResult = await this.putAHTTPServerToCaddy().then(data => {
                console.log('now there is a http server in caddy.');
            }).catch(error => {
                console.log(error);
                console.log('can\'t put a http server to caddy.');
                process.exit(1);
            });
            return true;
        }

        let routesCheck = await this.isRoutesConfigured();
        if (!routesCheck) {
            console.log('found no routes pointing to our backends, try to make some');

            let routes = this.getRoutes();
            let putRoutesToCaddyResult = await this.appendsRoutesToCaddy(httpEntry, routes);
            if (! putRoutesToCaddyResult) {
                console.log('we can\'t put routes to caddy.');
                process.exit(1);
            }

            console.log('routes created.');
        }

        return true;
    }
}

