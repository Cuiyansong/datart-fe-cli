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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartConfig, {
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getColumnRenderName,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chart';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import { isEmpty } from 'lodash';
import Config from './config';

class $TemplateName extends Chart {
  // TODO: if the chart is no extra dependency that is no need to set this value.
  isISOContainer = 'xxx-chart';
  chart: any = null;
  config = Config;
  dependency = [
    'https://cdnjs.cloudflare.com/ajax/libs/antd/4.15.2/antd.min.css',
  ];

  constructor() {
    super('xxx-table-id', 'XXX Chart Name', 'xxx-icon');
    this.meta.requirements = [
      {
        group: [1, 999],
        aggregate: 1,
      },
      {
        group: 0,
        aggregate: [1, 999],
      },
    ];
  }

  onMount(containerId: string): void {
    this.chart = init(this.document.getElementById(containerId), 'default');
    this.chart.setOption({});
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

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    ); 
    
    return {}; 
  }
}
  
export default $TemplateName;
`;
