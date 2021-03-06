const chalk = require('chalk');
const path = require('path');
const replace = require('replace');
const {
  camelCase
} = require('lodash');
const {
  existsSync,
  outputFileSync,
  readFileSync,
  ensureDirSync,
  removeSync,
} = require('fs-extra');

const jsTemplate = require('../templates/components/react-component-javascript');
const tsTemplate = require('../templates/components/react-component-typescript');
const lessTempalte = require('../templates/components/react-component-less');
const jsLazyTemplate = require('../templates/components/react-component-javascript-lazy');
const tsLazyTemplate = require('../templates/components/react-component-typescript-lazy');
const testEnzymeJsTemplate = require('../templates/components/react-component-test-enzyme-javascript');
const licenseTmplate = require('../templates/components/license');
const vizSytleIndexTemplate = require('../templates/components/viz-style-templates/indexTemplate');
const vizSytleComponentTemplate = require('../templates/components/viz-style-templates/component');
const vizSytleConfigTemplate = require('../templates/components/viz-style-templates/config');
// const componentStoryTemplate = require('../templates/component/componentStoryTemplate');

function getComponentByType(args, cliConfigFile) {
  const hasComponentTypeOption = args.find(arg => arg.includes('--type'));

  // Check for component type option.

  if (hasComponentTypeOption) {
    const componentType = hasComponentTypeOption.split('=')[1]; // get the component type value
    const selectedComponentType = cliConfigFile.component[componentType];

    // If the selected component type does not exists in the cliConfigFile under `component` throw an error

    if (!selectedComponentType) {
      console.error(
        chalk.red(
          `
  ERROR: Please make sure the component type you're trying to use exists in the
  ${chalk.bold('datart-cli-config.json')} config file under the ${chalk.bold(
            'component',
          )} object.
              `,
        ),
      );

      process.exit(1);
    }

    // Otherwise return it.

    return selectedComponentType;
  }

  // Otherwise return the default component type.

  return cliConfigFile.component.default;
}

function getCorrespondingComponentFileTypes(component) {
  return Object.keys(component).filter(key => key.split('with').length > 1);
}

function getCustomTemplate(componentName, templatePath) {
  // --- Try loading custom template

  try {
    const template = readFileSync(templatePath, 'utf8');
    const filename = path
      .basename(templatePath)
      .replace('TemplateName', componentName);

    return {
      template,
      filename,
    };
  } catch (e) {
    console.error(
      chalk.red(
        `
ERROR: The custom template path of "${templatePath}" does not exist. 
Please make sure you're pointing to the right custom template path in your datart-cli-config.json config file.
        `,
      ),
    );

    return process.exit(1);
  }
}

function componentTemplateGenerator({
  cmd,
  componentName,
  cliConfigFile
}) {
  const {
    cssPreprocessor,
    testLibrary,
    usesCssModule,
    usesTypeScript,
  } = cliConfigFile;
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom component template.

  if (customTemplates && customTemplates.component) {
    // --- Load and use the custom component template

    const {
      template: customTemplate,
      filename: customTemplateFilename,
    } = getCustomTemplate(componentName, customTemplates.component);

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in component template

    template = usesTypeScript ? tsTemplate : jsTemplate;
    filename = usesTypeScript ? `${componentName}.tsx` : `${componentName}.js`;

    // --- If test library is not Testing Library or if withTest is false. Remove data-testid from template

    if (testLibrary !== 'Testing Library' || !cmd.withTest) {
      template = template.replace(` data-testid="TemplateName"`, '');
    }

    // --- If it has a corresponding stylesheet

    if (cmd.withStyle) {
      const module = usesCssModule ? '.module' : '';
      const cssPath = `${componentName}${module}.${cssPreprocessor}`;

      // --- If the css module is true make sure to update the template accordingly

      if (module.length) {
        template = template.replace(
          `'./TemplateName.module.css'`,
          `'./${cssPath}'`,
        );
      } else {
        template = template.replace(
          `{styles.TemplateName}`,
          `"${componentName}"`,
        );
        template = template.replace(
          `styles from './TemplateName.module.css'`,
          `'./${cssPath}'`,
        );
      }
    } else {
      // --- If no stylesheet, remove className attribute and style import from jsTemplate

      template = template.replace(` className={styles.TemplateName}`, '');
      template = template.replace(
        `import styles from './TemplateName.module.css';`,
        '',
      );
    }
  }

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function componentBaseGenerator({
  cmd,
  componentName,
  cliConfigFile
}) {
  const {
    showAll
  } = cliConfigFile;
  const {
    type
  } = cmd;

  if (type === buildInComponentFileTypes.FULL) {
    const basePath = `${cmd.path}/${componentName}/`;
    const license = licenseTmplate;
    ensureDirSync(basePath + '__tests__');
    ensureDirSync(basePath + 'assets');
    ensureDirSync(basePath + 'hooks');
    ensureDirSync(basePath + 'slice');

    outputFileSync(basePath + 'constants.ts', license);
    outputFileSync(basePath + 'index.ts', license);
    outputFileSync(basePath + 'Loadable.tsx', license);
    outputFileSync(basePath + 'types.ts', license);
    outputFileSync(basePath + 'style.less', license);
    outputFileSync(basePath + 'utils.ts', license);

    outputFileSync(basePath + 'slice/index.ts', license);
    outputFileSync(basePath + 'slice/selector.ts', license);
    outputFileSync(basePath + 'slice/types.ts', license);
  }

  const filename = '';
  const template = {};

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function componentVizStyleTemplateGenerator({
  cmd,
  componentName,
  cliConfigFile
}) {
  const {
    type
  } = cmd;

  if (type === buildInComponentFileTypes.VIZSTYLE) {
    const basePath = `${cmd.path}/${componentName}/`;
    const replace = (source, pattern, value) => source.replace(pattern, value);

    ensureDirSync(basePath + '__tests__');
    outputFileSync(basePath + 'index.ts', replace(vizSytleIndexTemplate, /\$TemplateName/g, componentName));
    outputFileSync(basePath + `${componentName}.tsx`, replace(vizSytleComponentTemplate, /\$TemplateName/g, componentName));
    outputFileSync(basePath + 'config.ts', replace(vizSytleConfigTemplate, /\$TemplateName/g, componentName));
  }

  const filename = '';
  const template = {};

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function componentStyleTemplateGenerator({
  cliConfigFile,
  cmd,
  componentName,
}) {
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom style template.

  if (customTemplates && customTemplates.style) {
    // --- Load and use the custom style template

    const {
      template: customTemplate,
      filename: customTemplateFilename,
    } = getCustomTemplate(componentName, customTemplates.style);

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    const {
      cssPreprocessor,
      usesCssModule
    } = cliConfigFile;
    const module = usesCssModule ? '.module' : '';
    const cssFilename = `${componentName}${module}.${cssPreprocessor}`;

    // --- Else use GRC built-in style template

    template = lessTempalte;
    filename = 'style.less';
  }

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function componentTestTemplateGenerator({
  cliConfigFile,
  cmd,
  componentName
}) {
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  const {
    testLibrary,
    usesTypeScript
  } = cliConfigFile;
  let template = null;
  let filename = null;

  // Check for a custom test template.

  if (customTemplates && customTemplates.test) {
    // --- Load and use the custom test template

    const {
      template: customTemplate,
      filename: customTemplateFilename,
    } = getCustomTemplate(componentName, customTemplates.test);

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    filename = `${componentName}.test.jsx`;
    template = testEnzymeJsTemplate;
  }

  return {
    componentPath: `${cmd.path}/${componentName}/${'__tests__'}/${filename}`,
    filename,
    template,
  };
}

function componentStoryTemplateGenerator({
  cliConfigFile,
  cmd,
  componentName,
}) {
  const {
    usesTypeScript
  } = cliConfigFile;
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom story template.

  if (customTemplates && customTemplates.story) {
    // --- Load and use the custom story template

    const {
      template: customTemplate,
      filename: customTemplateFilename,
    } = getCustomTemplate(componentName, customTemplates.story);

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in story template

    template = componentStoryTemplate;
    filename = usesTypeScript ?
      `${componentName}.stories.tsx` :
      `${componentName}.stories.js`;
  }

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function componentLazyTemplateGenerator({
  cmd,
  componentName,
  cliConfigFile
}) {
  const {
    usesTypeScript
  } = cliConfigFile;
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  let template = null;
  let filename = null;

  // Check for a custom lazy template.

  if (customTemplates && customTemplates.lazy) {
    // --- Load and use the custom lazy template

    const {
      template: customTemplate,
      filename: customTemplateFilename,
    } = getCustomTemplate(componentName, customTemplates.lazy);

    template = customTemplate;
    filename = customTemplateFilename;
  } else {
    // --- Else use GRC built-in lazy template

    template = usesTypeScript ? tsLazyTemplate : jsLazyTemplate;
    filename = usesTypeScript ? `Loadable.tsx` : `Loadable.js`;
  }

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

function customFileTemplateGenerator({
  componentName,
  cmd,
  cliConfigFile,
  componentFileType,
}) {
  const {
    customTemplates
  } = cliConfigFile.component[cmd.type];
  const fileType = camelCase(componentFileType.split('with')[1]);
  let filename = null;
  let template = null;

  // Check for a valid custom template for the corresponding custom component file.

  if (!customTemplates || !customTemplates[fileType]) {
    console.error(
      chalk.red(
        `
ERROR: Custom component files require a valid custom template. 
Please make sure you're pointing to the right custom template path in your datart-cli-config.json config file.
        `,
      ),
    );

    return process.exit(1);
  }

  // --- Load and use the custom component template.

  const {
    template: customTemplate,
    filename: customTemplateFilename,
  } = getCustomTemplate(componentName, customTemplates[fileType]);

  template = customTemplate;
  filename = customTemplateFilename;

  return {
    componentPath: `${cmd.path}/${componentName}/${filename}`,
    filename,
    template,
  };
}

// --- Built in component file types

const buildInComponentFileTypes = {
  COMPONENT: 'component',
  FULL: 'full',
  VIZSTYLE: 'vizStyle',
  STYLE: 'withStyle',
  TEST: 'withTest',
  STORY: 'withStory',
  LAZY: 'withLazy',
};

// --- Generate component template map

const componentTemplateGeneratorMap = {
  [buildInComponentFileTypes.FULL]: componentBaseGenerator,
  [buildInComponentFileTypes.COMPONENT]: componentTemplateGenerator,
  [buildInComponentFileTypes.STYLE]: componentStyleTemplateGenerator,
  [buildInComponentFileTypes.TEST]: componentTestTemplateGenerator,
  [buildInComponentFileTypes.LAZY]: componentLazyTemplateGenerator,
  [buildInComponentFileTypes.VIZSTYLE]: componentVizStyleTemplateGenerator,
  // [buildInComponentFileTypes.STORY]: componentStoryTemplateGenerator,
};

function generateComponent(componentName, cmd, cliConfigFile) {
  const componentFileTypes = [
    'component',
    'full',
    'vizStyle',
    ...getCorrespondingComponentFileTypes(cmd),
  ];

  componentFileTypes.forEach(componentFileType => {
    // --- Generate templates only if the component options (withStyle, withTest, etc..) are true,
    // or if the template type is "component"

    if (
      (cmd[componentFileType] &&
        cmd[componentFileType].toString() === 'true') ||
      componentFileType === buildInComponentFileTypes.COMPONENT ||
      componentFileType === buildInComponentFileTypes.FULL ||
      componentFileType === buildInComponentFileTypes.VIZSTYLE
    ) {
      const generateTemplate =
        componentTemplateGeneratorMap[componentFileType] ||
        customFileTemplateGenerator;

      const {
        componentPath,
        filename,
        template
      } = generateTemplate({
        cmd,
        componentName,
        cliConfigFile,
        componentFileType,
      });

      // escape file or folder generate when file type is must.
      if (componentFileType === buildInComponentFileTypes.FULL ||
        componentFileType === buildInComponentFileTypes.VIZSTYLE) {
        return;
      }

      // if already created, first delete
      if (existsSync(componentPath)) {
        removeSync(componentPath);
        // console.debug(chalk.red(`${filename} already exists in this path "${componentPath}".`));
      }

      try {
        outputFileSync(componentPath, template);

        replace({
          regex: 'TemplateName',
          replacement: componentName,
          paths: [componentPath],
          recursive: false,
          silent: true,
        });

        console.log(
          chalk.green(
            `${filename} was successfully created at ${componentPath}`,
          ),
        );
      } catch (error) {
        console.error(chalk.red(`${filename} failed and was not created.`));
        console.error(error);
      }
    }
  });
}

module.exports = {
  generateComponent,
  getComponentByType,
  getCorrespondingComponentFileTypes,
};
