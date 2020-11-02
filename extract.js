import { conn, connConfig } from './index';
import { scopeVariables } from "../core/dist/main";

export const dispatchState = state => {
        conn.send(
                JSON.stringify({
                        ...connConfig,
                        data: state
                })
        );
}

export const Devtools = () => {
        let nodeMaps = [];
        const variables = scopeVariables;
        const leafNodes = Object.values(variables.leafs);
        const onlyNodes = Object.values(variables.nodes);
        const allNodesNames = [...leafNodes, ...onlyNodes];
        const allNodes = { ...variables.leafs, ...variables.nodes };
        const treeNodes = leafNodes.map(x => extractTreeNodes(x));
        const nodeDataArray = constructNodeDataArray(allNodesNames);
        const linkDataArray = constructLinkDataArray(allNodes, allNodesNames);
        debugger;
        if (treeNodes.length > 0) {
                treeNodes.forEach(x => {
                        x = x.reverse();
                        for (let i = 0; i < x.length - 1; i++) {
                                const pivot1 = i;
                                const pivot2 = i + 1;
                                nodeMaps.push([x[pivot1], x[pivot2]]);
                        }
                });
        } else {
                // 
        }

}



const constructNodeDataArray = allNodesNames => {
        return allNodesNames.map((node, itr) => ({
                id: itr,
                text: node
        }))
}

const constructLinkDataArray = (allNodes, allNodesNames) => {
        debugger;
        allNodesNames.forEach(id => {
                debugger;
                const actions = allNodes[id].actions;
                const actionsKeys = Object.keys(actions);
                const actionValues = Object.values(actions);
        })
}

const extractTreeNodes = scope => {
        var obj = scope._reactInternalFiber;
        var result = [];
        var stop = 0; var str = "obj"; var val = ""
        while (stop === 0) {
                val = eval(str);
                if (val == null) {
                        stop = 1
                } else {
                        var name = val.type.name || "";
                        if (name.charAt(0) === "#")
                                result.push(val.type.name)
                        str += "._debugOwner";
                }
        }
        return result;
}