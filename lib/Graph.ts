type Index = string | number;

export type ObjectType<T> = {
   [key in Index]: T;
};
export type GraphType = ObjectType<Index[]>;
export type Visited = ObjectType<boolean>;
export type Distance = ObjectType<ObjectType<number>>;
export type Path = ObjectType<ObjectType<Index>>;

export default class Graph {
   public graph!: GraphType;
   public visited!: Visited;

   public distance: Distance = {};
   public pathLength: Distance = {};
   public path: Path = {};

   public constructor(graph: GraphType) {
      this.graph = graph;
      this.UnvisitAll();
   }

   public get length() {
      return Object.keys(this.graph).length;
   }

   public UnvisitAll() {
      this.visited = {};
      // eslint-disable-next-line guard-for-in
      for (const key in this.graph) {
         this.visited[key] = false;
      }
   }

   public AddEdge(key: number, value: number) {
      this.graph[key].push(value);
      this.graph[value].push(key);
   }

   private DFSUtils(vertice: Index, paths: Index[] = []) {
      this.visited[vertice] = true;
      paths.push(vertice);

      for (const neighbour of this.graph[vertice]) {
         // eslint-disable-next-line no-param-reassign
         if (!this.visited[neighbour]) paths = this.DFSUtils(neighbour, paths);
      }
      return paths;
   }

   public AllPairShortestPath({ cache = false }) {
      if (!cache) {
         this.distance = {};
         this.path = {};
      } else if (
         cache &&
         Object.keys(this.distance).length !== 0 &&
         Object.keys(this.path).length !== 0
      )
         return;

      // eslint-disable-next-line guard-for-in
      for (const vertice in this.graph) {
         this.distance[vertice] = {};
         this.path[vertice] = {};
         for (const neighbour in this.graph) {
            if (this.graph[vertice].includes(neighbour)) {
               this.distance[vertice][neighbour] = 1;
               this.path[vertice][neighbour] = neighbour;
            } else {
               this.distance[vertice][neighbour] = Infinity;
            }
         }
         this.distance[vertice][vertice] = 0;
         this.path[vertice][vertice] = vertice;
      }
      // eslint-disable-next-line guard-for-in
      for (const k in this.graph) {
         // eslint-disable-next-line guard-for-in
         for (const i in this.graph) {
            // eslint-disable-next-line guard-for-in
            for (const j in this.graph) {
               const dist = this.distance[i][k] + this.distance[k][j];
               if (this.distance[i][j] > dist) {
                  this.distance[i][j] = dist;
                  this.path[i][j] = this.path[i][k];
               }
            }
         }
      }
      // eslint-disable-next-line guard-for-in
      for (const i in this.graph)
         for (const j in this.graph) {
            if (this.distance[i][j] === Number.MAX_SAFE_INTEGER)
               delete this.distance[i][j];
         }
   }

   public Path(source: Index, dest: Index) {
      if (this.path[source] == null || this.path[source][dest] == null)
         return [];
      const path = [];
      for (let node = source; node !== dest; node = this.path[node][dest]) {
         if (node == null) {
            return [];
         }
         path.push(node);
      }
      path.push(dest);
      return path;
   }

   public PathLength(source: Index, dest: Index) {
      return this.Path(source, dest).length;
   }

   public CalculateDistancesBetweenAllElements({ cache = false }) {
      if (!cache) this.pathLength = {};
      else if (cache && Object.keys(this.pathLength).length > 0) return;
      this.AllPairShortestPath({ cache: true });
      // eslint-disable-next-line guard-for-in
      for (const i in this.path) {
         this.pathLength[i] = {};
         let sum = 0;
         let count = 0;
         // eslint-disable-next-line guard-for-in
         for (const j in this.path[i]) {
            const path = this.PathLength(i, j);
            this.pathLength[i][j] = path;
            sum += path;
            count += 1;
         }
         this.pathLength[i].count = sum / count;
      }
   }

   public CalculateAverageDistanceBetweenAllElements() {
      this.CalculateDistancesBetweenAllElements({ cache: true });
      return Object.keys(this.pathLength)
         .sort(
            (left, right) =>
               this.pathLength[left].count - this.pathLength[right].count
         )
         .map(key => this.pathLength[key]);
   }

   public ConnectedComponents() {
      this.UnvisitAll();
      const connections: Index[][] = [];
      for (const vertice in this.graph) {
         // eslint-disable-next-line no-param-reassign
         if (!this.visited[vertice]) {
            const curConnections = this.DFSUtils(vertice);
            connections.push(curConnections);
         }
      }
      return connections
         .sort((a, b) => {
            return a.length < b.length ? 1 : -1;
         })
         .filter(connection => connection.length > 2);
   }
}
