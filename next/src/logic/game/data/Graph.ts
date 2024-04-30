import Graph from "@/src/logic/game/Graph";

const graph = new Graph();

graph.addNode("Blue Home");
graph.addNode("Blue to Center");
graph.addNode("B to G");
graph.addNode("Blue to Red");
graph.addNode("Red Home");
graph.addNode("Red to Center");
graph.addNode("Red to Blue");
graph.addNode("R to G");
graph.addNode("Green Home");
graph.addNode("Green to Center");
graph.addNode("G to R");
graph.addNode("G to B");
graph.addNode("Gate RB");
graph.addNode("Gate GB");
graph.addNode("Gate RG");
graph.addNode("Center");
graph.addEdge("Blue Home", "Blue to Center");
graph.addEdge("Red Home", "Red to Center");
graph.addEdge("Green Home", "Green to Center");
graph.addEdge("Blue to Center", "Center");
graph.addEdge("Red to Center", "Center");
graph.addEdge("Green to Center", "Center");
graph.addEdge("Blue Home", "Blue to Red");
graph.addEdge("Blue to Red", "Gate RB");
graph.addEdge("Blue Home", "B to G");
graph.addEdge("B to G", "Gate GB");
graph.addEdge("Red Home", "R to G");
graph.addEdge("R to G", "Gate RG");
graph.addEdge("Red Home", "Red to Blue");
graph.addEdge("Red to Blue", "Gate RB");
graph.addEdge("Green Home", "G to B");
graph.addEdge("G to B", "Gate GB");
graph.addEdge("Green Home", "G to R");
graph.addEdge("G to R", "Gate RG");

export default graph;