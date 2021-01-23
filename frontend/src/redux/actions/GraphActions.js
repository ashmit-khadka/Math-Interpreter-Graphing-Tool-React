//increment action for Graph reducer.
export const enableGraphReset = () => {
    return {
        type:'RESET_GRAPH_ON',
    }
}

export const disableGraphReset = () => {
    return {
        type:'RESET_GRAPH_OFF',
    }
}

