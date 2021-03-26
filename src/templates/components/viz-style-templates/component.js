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
import VizConfig from './VizConfig';

class $TemplateName extends Chart {
    constructor(id?, name?) {
      super(id || 'line', name || 'Basic Line Chart');
    }
  
    config = {
      vizConfig: VizConfig,
    };
  
    getDependencies(): string[] {
      return ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'];
    }
  
    initHooks<TData>(
      hooks: ChartEventBroker,
      config: any,
      doc: any,
      win: any,
    ): void {
      let chart: any = null;
      let option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }]
      };
  
      hooks.subscribe('mounted', (containerId: string) => {
        chart = win.echarts.init(doc.getElementById(containerId), 'default');
        // TODO: optinal render table, without any data or just render default sample chart.
        chart.setOption(option);
      });
  
      hooks.subscribe('updated', (data: TData) => {
        chart &&
          chart.setOption(
            Object.assign({}, option, {
              xAxis: { data: ['1', '2'] },
              series: [{ data: ['1'], type: 'line' }],
            }),
          );
      });
  
      hooks.subscribe('unmount', () => {
        chart && chart.dispose();
      });
    }
  }
  
export default $TemplateName;
`;
