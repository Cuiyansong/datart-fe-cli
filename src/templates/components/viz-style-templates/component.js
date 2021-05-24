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
  // TODO: if the chart is no extra dependency that is no need to set this value.
  isISOContainer = 'xxx-chart';
  config = Config;
  dependency = [
    'https://cdnjs.cloudflare.com/ajax/libs/antd/4.15.2/antd.min.css',
  ];

  constructor() {
    super('xxx-table-id', 'XXX Chart Name', 'xxx-icon', ReactTable);
    this.meta.requirements = [
      {
        group: [0, 999],
        aggregate: [0, 999],
      },
    ];
  }

  onMount(containerId: string): void {
    this.chart = this.window.echarts.init(
      this.document.getElementById(containerId),
      'default',
    );
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    this.chart?.clear();
    if (!this.isMatchRequirement(props.config)) {
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions));
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  getOptions(dataset: VizDataset, config: ChartConfig) { return {}; }
}
  
export default $TemplateName;
`;
