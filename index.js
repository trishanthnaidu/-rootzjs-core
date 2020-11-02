import React from 'react';
import { getAllState, scopeVariables } from '../core/dist/main';

const connect = ({
        config,
        Component,
        environment,
}) => {
        const id = "#Rootz";
        return {
                [id]: props => {
                        if (!config.hasOwnProperty("sessionId") && !config.hasOwnProperty("type")) {
                                console.log(
                                        "%cInalid config. Visit www.devtools.rootzjs.org for setup Instructions",
                                        "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                )
                                return <Component {...props} />
                        }
                        if (environment !== "development") {
                                console.log(
                                        "%cRootz Devtools is only applicable for 'development' environment",
                                        "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                )
                                return <Component {...props} />
                        }
                        React.useEffect(() => {
                                const ws = window.WebSocket || window.MozWebSocket;
                                if (!window.WebSocket) {
                                        console.log(
                                                "%cSorry, but your browser doesn\'t support WebSocket",
                                                "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                        );
                                        return;
                                }
                                // connection
                                let conn = new ws('ws://localhost:1918');
                                conn.onopen = function () {
                                        console.log(
                                                "%cconnetion Ok...",
                                                "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                        );
                                        conn.send(JSON.stringify(config));
                                };
                                conn.onerror = function (error) {
                                        console.log(
                                                "%cSorry, but there\'s some problem with your connection or the server is down",
                                                "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                        )
                                };
                                conn.onmessage = function (resp) {
                                        try {
                                                let data = JSON.parse(resp.data);
                                                if (data.isConnected) {
                                                        console.log(`%cConnected to host-${config.sessionId} Successfully`, "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;");
                                                        conn.send(JSON.stringify({ appState: getAllState(), scopeVar: scopeVariables }));
                                                } else {
                                                        console.log(`%cError in connecting to the host-${config.sessionId}, please clear your cache and check with newer sessionId`, "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;");
                                                }
                                        } catch (e) {
                                                console.log(
                                                        "%cInvalid JSON",
                                                        "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;"
                                                )
                                                return;
                                        }
                                };
                        }, []);
                        return <Component {...props} />
                }
        }[id];
}

export default { connect }



