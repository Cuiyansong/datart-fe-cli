module.exports = `/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Chart from 'app/models/Chart';
import ChartEventBroker from 'app/models/ChartEventBroker';
import Config from './config';

class $TemplateName extends Chart {
    constructor() {
      // TODO: change the chart name and it should be unique.
      super('line', 'Basic Line Chart', 'line-chart');
    }
  
    // TODO: if the chart is no extra dependency that is no need to set this value.
    isISOContainer = 'xxxx-container';
    config = Config;
    dependency = [];
    chart: any = null;
  
    onMount(containerId: string): void {
      this.chart = this.window.echarts.init(
        this.document.getElementById(containerId),
        'default',
      );
      this.chart.setOption(this.option);
    }
  
    onUpdated({ config }: { config: any }): void {
      this.chart.setOption(Object.assign({}, config));
    }
  
    onUnMount(): void {}
  }
  
export default $TemplateName;
`;
