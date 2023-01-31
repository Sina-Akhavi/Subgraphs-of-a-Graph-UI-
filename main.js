const layout = {
  name: 'circle'
};

const autoungrabify = true;

const style = [
  {
    selector: 'node',
    style: {
        'background-color': 'green',
        'label': 'data(label)'
    }
  },
  {
    selector: 'edge',
    style: {
        'width': 3,
        'line-color': 'red',
        'target-arrow-color': 'red',
        'curve-style': 'bezier'
    }
  }
];

const styleOfMainGraph = [
  {
    selector: 'node',
    style: {
      'background-color': 'orange',
      'label': 'data(label)'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': 'brown',
      'target-arrow-color': 'red',
      'curve-style': 'bezier'
    }
  }
]

var subgraphCounter = 1;



var graph = [[0 ,1, 0, 1],
             [1, 0, 1, 1],
             [0, 1, 0, 1],
             [1, 1, 1, 0]]

produceSubgraphs(graph);

function produceSubgraphs(graph) {
  let vertices = createListOfVertices(graph.length); // correct it !!!

  let verticesPowerSet = createPowerSet(vertices);

  for(let verticesSet of verticesPowerSet) {
    // if (verticesSet.length == 0) {
    //   continue;
    // }
    
    let localEdges = calculateRelatedEdges(verticesSet);
    let localEdgesPowerSet = createPowerSet(localEdges);
    printSubgraphs(verticesSet, localEdgesPowerSet);
  }

}

function createListOfVertices(n) {
  let output = [];
  for (let i = 0; i < n; i++) {
    output.push(i);
  }
  return output;
}

function printSubgraphs(verticesSet, localEdgesPowerSet) {
  console.log(`subgraphs for vertices ${verticesSet} are as follows: `);
  for (let localEdges of localEdgesPowerSet) {
    drawSubgraph(verticesSet, localEdges);
    console.log(localEdges);
  }
}

function drawSubgraph(verticesSet, localEdges) {
  const divEl = document.createElement("div");
  divEl.id = `cy${subgraphCounter}`;
  divEl.className = 'cy';
  
  const headline = document.createElement("h4");
  headline.innerHTML = `subgraph ${subgraphCounter}`;
  subgraphCounter++;
  
  divEl.appendChild(headline);
  
  document.body.appendChild(divEl);
  const subgraphElements = produceElemets(verticesSet, localEdges);

  createSubgraph(subgraphElements, divEl);
}

function createSubgraph(subgraphElements, divEl) {
  var subgraph = cytoscape({
    layout: layout,

    autoungrabify: autoungrabify,

    container: divEl,

    elements: subgraphElements,

    style: style
  });

  // subgraph.mount(divEl);


  if (subgraphCounter == 2) {
    var subgraph = cytoscape({
      layout: layout,
  
      autoungrabify: autoungrabify,
  
      container: document.getElementById('main-graph'),
  
      elements: subgraphElements,
  
      style: styleOfMainGraph
    });
  
  }

}

function produceElemets(verticesSet, localEdges) {
  // const elements = ;
  
  const nodes = produceObjectNodes(verticesSet);
  const edges = produceObjectEdges(localEdges);

  const elements = nodes.concat(edges);

  return elements;
}

function produceObjectNodes(vertices) {
  let tempNodes = [];
  for (let vertice of vertices) {
    tempNodes.push({
      data: {id: vertice, label: vertice}
    });
  }

  const nodes = tempNodes;
  return nodes;

}


function produceObjectEdges(edges) {
  let tempEdges = [];

  for (let edge of edges) {
    const id = `${edge[0]}${edge[1]}`;
    const source = `${edge[0]}`;
    const target = `${edge[1]}`;

    tempEdges.push({
      data: { id: id, source: source, target: target}
    })
  }

  const objectEdjes = tempEdges;
  return objectEdjes;

}

function calculateRelatedEdges(vertices) {
  let localEdges = [];

  for (let i = 0; i < vertices.length; i++) {
    let source = vertices[i];
    for (let j = i + 1; j < vertices.length; j++) {
      let target = vertices[j];

      if (graph[source][target] == 1) {
        localEdges.push([source, target]);
      }
    }
  }

  return localEdges;

}

function createPowerSetUtil(mainList, res, n, powerSet) {
  if (n == 0) {
    let clonedList = [... res];
    powerSet.push(clonedList);
    return;
  }

  res.push(mainList[n - 1]);

  createPowerSetUtil(mainList, res, n - 1, powerSet);
  res.pop();
  createPowerSetUtil(mainList, res, n - 1, powerSet);

}

function createPowerSet(myList) {
  let powerSet = [];

  let ans = [];
  let n = myList.length;
  createPowerSetUtil(myList, ans, n, powerSet);

  return powerSet;
}


