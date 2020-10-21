// https://github.com/rootzjs/store v1.1.0 Copyright 2019 Trishanth Naidu
import React, { useReducer } from 'react';
/*
* Variable Declarations - Start Here
*/
const store = { __timeStamp: 0 };

let componentStateHandler = {};
let contextStore = {};
const commonStyles = "color: #fff; font-size:12px; margin-left: 7px; border-radius: 3px; padding: 2px 7px 2px 7px;"
const consoleColorCode = {
        common: {
                el: commonStyles + " background-color: #ff980094;",
                title: commonStyles + " background-color: #93ce09de;",
                context: commonStyles + " background-color: #55555597;",
        },
        error: {
                brand: "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #e91e63a9;",
        },
        warning: {
                brand: "color: #fff; font-size:12px;  border-radius: 3px; padding: 2px 0 2px 7px; text-align: center; background-color: #ffc107;",
        }
}
const ERROR = {
        NODE_NAME_ALREADY_EXISTS: name => `%cRootzJs Error %c${name} %cDuplicate entry found, Node Name already exists`,
        LEAF_NAME_ALREADY_EXISTS: name => `%cRootzJs Error %c${name} %cDuplicate entry found, Leaf Name already exists`,
        ACTIONS_ARE_NOT_FUNCTION: name => `%cRootzJs Error %c${name} %cInvalid type Actions, Actions should be of type function`,
        INVALID_CONTRACT_TYPE: name => `%cRootzJs Error %c${name} %cInvalid Contract type, create a contract by 'Rootz.createContract' hook only`,
        STATE_OF_SWITCH_SHOULD_BE_BOOLEAN: name => `%cRootzJs Error %c${name} %cInvalid type intialState, initialState should be of type Boolean`,
        CONTRACTS_ARE_NOT_FUNCTION: name => `%cRootzJs Error %c${name} %cInvalid type Actions in Contract, Actions passed in Contract should be of type function`,
}
const WARNING = {
        FOUND_MULTIPLE_PROP_FOR_LEAF_SWITH: name => `Found multiple props, Expected Single prop 'bool' for LeafSwitch ${name}`
}
/*
* Variable Declarations - Ends Here
*/

/*
* Intrinsic Functions - Start Here
*/
const setImmutableObject = (state, newState) => Object.assign({}, state, newState);
const setLeafState = (leafId, nodeId, state) => {
        if (!store.hasOwnProperty(nodeId)) {
                setNodeState(nodeId, {});
        }
        store[nodeId]["leafs"][leafId] = setImmutableObject(store[nodeId]["leafs"][leafId], state);
};
const updateLeafState = (leafId, nodeId, state) => {
        setLeafState(leafId, nodeId, state);
        requestUpdate(leafId);
};
const setNodeState = (nodeId, state) => {
        if (!store.hasOwnProperty(nodeId)) {
                store[nodeId] = { "state": {}, "leafs": {} };
        }
        store[nodeId]["state"] = setImmutableObject(store[nodeId]["state"], state);
};
const updateNodeState = (nodeId, state) => {
        setNodeState(nodeId, state);
        requestUpdate(nodeId);
};
const validateNodeId = nodeId => {
        // check if the leafId already exists
        if (store.hasOwnProperty(nodeId)) {
                console.log(ERROR.NODE_NAME_ALREADY_EXISTS(nodeId), consoleColorCode.error.brand, consoleColorCode.common.title, consoleColorCode.common.context);
                throw new Error();
        }

}
const validateLeafId = (leafId, nodeId) => {
        // check if the leafId already exists
        if (store.hasOwnProperty(nodeId) && store[nodeId]["leafs"].hasOwnProperty(leafId)) {
                console.log(ERROR.LEAF_NAME_ALREADY_EXISTS(leafId), consoleColorCode.error.brand, consoleColorCode.common.title, consoleColorCode.common.context);
                throw new Error();
        }
}
const validateActions = (actions, id) => {
        if (typeof actions !== "function") {
                console.log(ERROR.ACTIONS_ARE_NOT_FUNCTION(id), consoleColorCode.error.brand, consoleColorCode.common.title, consoleColorCode.common.context);
                throw new Error();
        }
}
const validateContract = (contract, id) => {
        if (contract[0] && contract[0].__type && contract[0].__type !== "contract") {
                console.log(ERROR.INVALID_CONTRACT_TYPE(id), consoleColorCode.error.brand, consoleColorCode.common.title, consoleColorCode.common.context);
                throw new Error();
        }
}
const getLeafState = (leafId, nodeId) => {
        let emptyState = {};
        return setImmutableObject(emptyState, store[nodeId]["leafs"][leafId]);
}
const getNodeState = nodeId => {
        let emptyState = {};
        return setImmutableObject(emptyState, store[nodeId]["state"]);
}
const setHandlerVariable = (id, stateHandlerVariable) => {
        componentStateHandler = setImmutableObject(componentStateHandler, {
                [id]: stateHandlerVariable
        });
}
const requestUpdate = id => {
        const requestedBranch = componentStateHandler[id];
        const rootzStateHandlerVariable = requestedBranch.__rootzStateHandlerVariable;

        requestedBranch.stateHandler({ __rootzStateHandlerVariable: rootzStateHandlerVariable + 1 });
}
const setHandler = (storeID, handler) => {
        componentStateHandler[storeID] = setImmutableObject(componentStateHandler[storeID], {
                stateHandler: handler
        });
}
/*
* Intrinsic Functions - Ends Here
*/

/*
* Access Functions - Starts Here
*/
const setContext = state => {
        contextStore = setImmutableObject(contextStore, state);
}
const getAllState = () => store;
const getContext = () => contextStore;

const createNode = ({
        id,
        Component,
        state = {},
        actions = [[], []],
}) => {
        // check if the nodeId already exists
        //validateNodeId(id);

        // create a state handler variable for refreshing the state
        const stateHandlerVariable = { __rootzStateHandlerVariable: 0 };

        // Store the initial State in the applicaton Store
        setNodeState(id, state);

        // sets the handler variable in the Store
        setHandlerVariable(id, stateHandlerVariable);

        const NodeDefinition = {
                [id]: props => {
                        let derivedActions = {};
                        const [currState, updateCurrState] = useReducer(
                                (state, newState) => ({ ...state, ...newState }),
                                stateHandlerVariable
                        );
                        const context = getContext();
                        // fetches the latest state everytime the package is called
                        const state = Node.getState(id);

                        const selfActions = actions[0] || [];
                        const contract = actions[1] || [];

                        selfActions.forEach(func => {
                                validateActions(func, id);
                                derivedActions[func.name] = (...props) => {
                                        const derivedState = func(...props);
                                        updateNodeState(id, derivedState);
                                }
                        });
                        if (contract.length > 0) {
                                validateContract(contract);
                                derivedActions = { ...derivedActions, ...contract[0] }
                        }

                        // setting the handler
                        setHandler(id, updateCurrState);

                        return <Component
                                state={state}
                                props={props}
                                context={context}
                                actions={derivedActions}
                        />
                }
        }

        return NodeDefinition[id];
}
const Node = {
        setState: (id, state) => updateNodeState(id, state),
        getState: id => getNodeState(id),
}

const createLeaf = ({
        id,
        nodeId,
        updateIf,
        Component,
        state = {},
        actions = [[], []],
}) => {
        // check if the leafId already exists
        validateLeafId(id, nodeId);

        // create a state handler variable for refreshing the state
        const stateHandlerVariable = { __rootzStateHandlerVariable: 0 };

        // Store the initial State in the applicaton Store
        setLeafState(id, nodeId, state);

        // sets the handler variable in the Store
        setHandlerVariable(id, stateHandlerVariable);

        const LeafDefinition = {
                [id]: class extends React.PureComponent {
                        constructor(props) {
                                super(props);
                                this.state = stateHandlerVariable;
                                this.derivedActions = {};

                                const selfActions = actions[0] || [];
                                const nodeActions = actions[1] || [];

                                selfActions.forEach(func => {
                                        validateActions(func, id);
                                        this.derivedActions[func.name] = (...props) => {
                                                const derivedState = func(...props);
                                                updateLeafState(id, nodeId, derivedState);
                                        }
                                });

                                nodeActions.forEach(func => {
                                        validateActions(func, id);
                                        this.derivedActions[func.name] = (...props) => {
                                                const derivedState = func(...props);
                                                updateNodeState(nodeId, derivedState);
                                        }
                                });
                        }
                        shouldComponentUpdate = updateIf
                        render() {
                                // fetches the latest state everytime the package is called
                                const state = Leaf.getState(id, nodeId);
                                const context = getContext();

                                return <Component
                                        state={state}
                                        context={context}
                                        props={this.props}
                                        actions={this.derivedActions}
                                />
                        }
                }
        }

        return LeafDefinition[id];
}
const Leaf = {
        setState: (id, nodeId, state) => updateLeafState(id, nodeId, state),
        getState: (id, nodeId) => getLeafState(id, nodeId),
}
const createContract = actionsMappings => {
        let contractActions = { __type: "contract" };
        const keys = Object.keys(actionsMappings);
        keys.forEach(id => {
                const func = actionsMappings[id];
                validateActions(func, id);
                contractActions[func.name] = (...props) => {
                        const derivedState = func(...props);
                        updateNodeState(id, derivedState);
                }
        });
        return [contractActions];
}
export { Node, Leaf, setContext, getAllState, getContext };
export default {
        createNode,
        createLeaf,
        createContract,
}
/*
* Access Functions - Ends Here
*/