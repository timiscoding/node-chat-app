/* eslint-disable class-methods-use-this */

/* This plugin changes the way __dirname and __filename behave by returning absolute
   dirname or filename from the *input* file instead of where the module is executed
   (which can change depending on the build environment).

   For instance, you might have the bundled file in root/dist in production while
   in a testing environment it may go in root/test/.tmp/mocha.

    root
    |-- dist
    |   `-- server.bundle.js
    |-- public
    |-- src
    |   `-- server.js
    `-- test
        `-- .tmp
            `-- mocha
                `-- server.bundle.js

  If your code makes references to paths relative to __dirname like
  path.join(__dirname, '../public'), then the production build will point correctly to
  the assets but the bundle in test won't as it will look for the public folder in .tmp.

  This plugin fixes that by making __dirname/__filename point to the absolute path from
  the source input file. (src/server.js in the example)

  Original idea from comment https://github.com/webpack/webpack/issues/1599#issuecomment-266588898
  Adapted plugin from https://github.com/webpack/webpack/blob/02a955b4335cb7eeeb4dd1c96ef5407c6bcea158/lib/NodeStuffPlugin.js
*/

export default class WebpackFileDirnamePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'WebpackFileDirnamePlugin',
      (compilation, { normalModuleFactory }) => {
        const handler = (parser) => {
          const setModuleConstant = (expressionName, fn) => {
            parser.hooks.expression
              .for(expressionName)
              .tap('WebpackFileDirnamePlugin', () => {
                parser.state.current.addVariable(
                  expressionName,
                  JSON.stringify(fn(parser.state.module)),
                );
                return true;
              });
          };

          setModuleConstant('__filename', module => module.resource);
          setModuleConstant('__dirname', module => module.context);
        };

        normalModuleFactory.hooks.parser
          .for('javascript/auto')
          .tap('WebpackFileDirnamePlugin', handler);
        normalModuleFactory.hooks.parser
          .for('javascript/dynamic')
          .tap('WebpackFileDirnamePlugin', handler);
      },
    );
  }
}
