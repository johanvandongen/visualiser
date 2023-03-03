import '@testing-library/jest-dom';
import { Network } from '../Network';

test("test", () => {
    const nw = new Network()
    const color = "black"
    nw.addVertex(1)
    nw.addVertex(2)
    nw.addVertex(3)
    nw.addEdge(1, 2)
    nw.addEdge(2, 3)
    const expected = new Map()
    expected.set(1, [{node: 2, weight: 1, color: color}])
    expected.set(2, [{node: 1, weight: 1, color: color}, {node: 3, weight: 1, color: color}])
    expected.set(3, [{node: 2, weight: 1, color: color}])

    expect(nw.adjList).toEqual(expected);
});

test("invalid vertex error", () => {
    const nw = new Network()
    expect(() => nw.addVertex({node: 1})).toThrow(Error)
    expect(() => nw.addVertex(1)).not.toThrow(Error)
});