const outlineRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    size: 3,
    symbol: {
        type: "simple-line",
        color: 'rgba(43, 45, 66, 0.9)'
    },
}

const stateRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    size: 4,
    symbol: {
        type: "simple-fill",
        color:
            'rgba(141,153,174,0.4 )'
    },
}

const countiesRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    size: 1,
    symbol: {
        type: "simple-line",
        color:
            'rgba(239,35,60, 0.3)'
    },
}

const congressionalRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    size: 4,
    symbol: {
        type: "simple-line",
        color:
            'rgba(0,0,102, 0.7)'
    },
}


export {
    outlineRenderer,
    stateRenderer,
    congressionalRenderer,
    countiesRenderer,
}