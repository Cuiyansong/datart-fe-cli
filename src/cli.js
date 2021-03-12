const program = require('commander');

const pkg = require('../package.json');
const { initGenerateComponentCommand } = require('./commands/generator');
const { getCLIConfigFile } = require('./utils/config');

module.exports = async function cli(args) {
  const cliConfigFile = await getCLIConfigFile();

  initGenerateComponentCommand(args, cliConfigFile, program);

  program.version(pkg.version);
  program.parse(args);
};
