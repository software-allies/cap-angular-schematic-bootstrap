import { Schema as BootstrapSchema } from './schema';
import { Rule, Tree, chain, SchematicContext, branchAndMerge, noop } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson } from './../utils/package';
import { addStyle, hasBootstrap } from './../utils/config';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { getFileContent } from '@schematics/angular/utility/test';
// import {addModuleImportToRootModule} from './../utils/ast';

/*
const ngBootstrapVersion = '2.0.0-alpha.0';
function addNgBootstrapToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', '@ng-bootstrap/ng-bootstrap', `^${ngBootstrapVersion}`);
    return host;
  };
}*
function addNgBootstrapModuleToAppModule(): Rule {
  return (host: Tree) => {
    addModuleImportToRootModule(host, 'NgbModule.forRoot()', '@ng-bootstrap/ng-bootstrap');
    return host;
  };
}*/

const typesJquery = '3.3.29';

function addBootstrapToPackageJson(options: BootstrapSchema): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', 'bootstrap', `^${options.version}`);
    addPackageToPackageJson(host, 'devDependencies', '@types/jquery', `^${typesJquery}`);
    return host;
  };
}

function addBootstrapCSS(): Rule {
  return (host: Tree) => {
    addStyle(host, './node_modules/bootstrap/dist/css/bootstrap.css');
    return host;
  };
}

function installNodeDeps(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    return host;
  }
}

function addJqueryPluginToWebpackConfig(): Rule {
    return (tree: Tree) => {
      
      const filePath = '/webpack.server.config.js';
      const buffer = tree.read(filePath);
      if (buffer === null) {
        console.log('webpack.server.config.js not exist.');
      }

      // Add to configuration and api routes on server.js
      const toAdd = 
`
  new webpack.ProvidePlugin({
    "window.$": "jquery",
    "window.jQuery": "jquery"
  }),
`;

      const appComponent = getFileContent(tree, filePath);
      tree.overwrite(filePath, appComponent.replace(`plugins: [`, `plugins: [` + toAdd));

    }
}

export function schematicsBootstrap(options: BootstrapSchema): Rule {
  return (host: Tree, context: FileSystemSchematicContext) => {
    if (!hasBootstrap(host)) {
      return chain([
        branchAndMerge(chain([
          addBootstrapToPackageJson(options),
          addJqueryPluginToWebpackConfig(),
          addBootstrapCSS(),
          installNodeDeps(),
        ])),
      ])(host, context);
    } else {
      noop();
    }
  };
}
