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

import ChartConfig from 'app/pages/VizWorkbenchPage/models/ChartConfig';

const config: ChartConfig = {
  data: [
    {
      label: 'metrics',
      key: 'metrics',
      actions: ['sortable', 'alias'],
    },
    {
      label: 'deminsion',
      key: 'deminsion',
      columns: [],
      actions: ['format', 'aggregate'],
    },
  ],
  style: [
    {
      label: 'label',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'showLabel',
          key: 'showLabel',
          default: false,
          comType: 'checkbox',
          options: {},
        },
        {
          label: 'showLabelBySwitch',
          key: 'showLabelBySwitch',
          default: true,
          comType: 'switch',
          options: {},
          watcher: {
            deps: ['showLabel'],
            action: ({ ...props }) => {
              return {
                disabled: !props.showLabel,
              };
            },
          },
        },
        {
          label: 'showDataColumns',
          key: 'dataColumns',
          comType: 'columnSelector',
          options: {
            getItems: cols => {
              const sections = (cols || []).filter(col =>
                ['metrics', 'deminsion'].includes(col.key),
              );
              const columns = sections.reduce(
                (acc, cur) => acc.concat(cur.columns || []),
                [],
              );
              return columns.map(c => ({
                id: c.colName,
                key: c.colName,
                label: c.label,
              }));
            },
          },
        },
        {
          label: 'fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: '??????',
        },
        {
          label: 'fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: '20',
        },
      ],
    },
  ],
  i18n: [
    {
      lang: 'zh-CN',
      translation: {
        label: '??????',
        showLabel: '????????????',
        showLabelBySwitch: '????????????2',
        showLabelByInput: '????????????3',
        showLabelWithSelect: '????????????4',
        fontFamily: '??????',
        fontSize: '????????????',
        fontColor: '????????????',
        rotateLabel: '????????????',
        showDataColumns: '???????????????',
        legend: {
          label: '??????',
          showLabel: '??????-????????????',
          showLabel2: '??????-????????????2',
        },
      },
    },
    {
      lang: 'en',
      translation: {
        label: 'Label',
        showLabel: 'Show Label',
        showLabelBySwitch: 'Show Lable Switch',
        showLabelWithInput: 'Show Label Input',
        showLabelWithSelect: 'Show Label Select',
      },
    },
  ],
};

export default config;
`;
