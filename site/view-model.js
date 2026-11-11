'use strict';
const AtlasView = (() => {
  const screeningVersion = '1.1.0';
  const weeklySnapshot = radar => radar.weeklyPolicyVersion === screeningVersion ? radar.weekly : [];
  const directionIds = {D1:'measurement', D2:'simulation', D3:'clinical', D4:'methods', D5:'education'};
  function weeklyDirections(directions, weekly) {
    return directions.map((direction, index) => ({direction, index, live:(weekly || []).find(row => row.id === directionIds[direction.id])}))
      .sort((a,b) => {
        const count = x => Number.isInteger(x.live?.count) && x.live.count >= 0 ? x.live.count : -1;
        return count(b) - count(a) || a.index - b.index;
      });
  }
  function networkSlice(graph, state) {
    let nodes = graph.nodes.filter(n => state.domain === 'all' || n.layer === 'technology' || n.domains.includes(state.domain));
    const allowed = new Set(nodes.map(n => n.id));
    let edges = graph.edges.filter(e => (state.edge === 'all' || e.type === state.edge) && allowed.has(e.source) && allowed.has(e.target));
    if (state.domain !== 'all') {
      const used = new Set(edges.flatMap(e => [e.source,e.target]));
      nodes = nodes.filter(n => used.has(n.id));
    }
    if (state.query) {
      const query = state.query.toLowerCase();
      const matches = new Set(nodes.filter(n => [n.title,n.en,n.description,n.risk,n.metric,n.id].join(' ').toLowerCase().includes(query)).map(n => n.id));
      const relevant = new Set(matches);
      edges.forEach(e => {if(matches.has(e.source) || matches.has(e.target)){relevant.add(e.source);relevant.add(e.target);}});
      nodes = nodes.filter(n => relevant.has(n.id));
      edges = edges.filter(e => relevant.has(e.source) && relevant.has(e.target));
    }
    return {nodes,edges};
  }
  return {screeningVersion,weeklySnapshot,weeklyDirections,networkSlice};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = AtlasView;
if (typeof window !== 'undefined') window.ATLAS_VIEW = AtlasView;
