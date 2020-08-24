import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

import GraphT from './Graph';
import { RESULTS_DIR } from './env';

export default class Graph extends GraphT {
   static async WriteFile(fileName: string, data: unknown) {
      const print =
         typeof data === 'object'
            ? JSON.stringify(data, null, 3)
            : String(data);
      await writeFile(join(RESULTS_DIR, fileName), print, 'utf8');
   }

   static ExistsFile(fileName: string) {
      return existsSync(join(RESULTS_DIR, fileName));
   }

   static async ReadFile(fileName: string) {
      return await readFile(join(RESULTS_DIR, fileName), 'utf8');
   }

   public async AllPairShortestPath({ cache = false }) {
      if (
         cache &&
         Graph.ExistsFile('distance.json') &&
         Graph.ExistsFile('path.json')
      ) {
         await this.Read();
         return;
      }
      super.AllPairShortestPath({ cache: cache });
      await this.Save();
   }

   private async Read() {
      this.distance = JSON.parse(await Graph.ReadFile('distance.json'));
      this.path = JSON.parse(await Graph.ReadFile('path.json'));
   }

   private async Save() {
      await Graph.WriteFile('distance.json', this.distance);
      await Graph.WriteFile('path.json', this.path);
   }
}
