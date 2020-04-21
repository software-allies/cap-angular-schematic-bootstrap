import { Schema as BootstrapSchema } from './schema';
import { Rule, Tree, chain, SchematicContext, branchAndMerge, noop } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageToPackageJson } from './../utils/package';
import { addStyle, hasBootstrap, addScript } from './../utils/config';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { getFileContent } from '@schematics/angular/utility/test';
// import {addModuleImportToRootModule} from './../utils/ast';

/*
function addNgBootstrapModuleToAppModule(): Rule {
  return (host: Tree) => {
    addModuleImportToRootModule(host, 'NgbModule.forRoot()', '@ng-bootstrap/ng-bootstrap');
    return host;
  };
}*/

const dependencyVersions = {
  "bootstrap": "^4.4.1",
  "jquery": "3.4.1",
  "popper": "^1.16.1",
  "typesJquery": "3.3.29"
};

function addBootstrapToPackageJson(options: BootstrapSchema): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', 'jquery', `${options.jquery}`);
    addPackageToPackageJson(host, 'dependencies', 'popper.js', `${options.popper}`);
    addPackageToPackageJson(host, 'dependencies', 'bootstrap', `${options.bootstrap}`);
    addPackageToPackageJson(host, 'devDependencies', '@types/jquery', `${options.typesJquery}`);
    return host;
  };
}

function addStyles(): Rule {
  return (host: Tree) => {
    addStyle(host, './node_modules/bootstrap/dist/css/bootstrap.css');
    return host;
  };
}

function addScripts(): Rule {
  return (host: Tree) => {
    addScript(host, './node_modules/jquery/dist/jquery.min.js');
    addScript(host, './node_modules/popper.js/dist/umd/popper.min.js');
    addScript(host, './node_modules/bootstrap/dist/js/bootstrap.min.js');
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
      if (buffer !== null) {

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
      } else {
        console.log('webpack.server.config.js not exist.');
      }
    }
}

export function schematicsBootstrap(options: BootstrapSchema): Rule {

  if (!options.bootstrap) {
      options.bootstrap = dependencyVersions.bootstrap;
  }
  if (!options.popper) {
      options.popper = dependencyVersions.popper;
  }
  if (!options.jquery) {
      options.jquery = dependencyVersions.jquery;
  }
  if (!options.typesJquery) {
      options.typesJquery = dependencyVersions.typesJquery;
  }

  return (host: Tree, context: FileSystemSchematicContext) => {
    if (!hasBootstrap(host)) {
      return chain([
        branchAndMerge(chain([
          addBootstrapToPackageJson(options),
          (!options.skipWebpackPlugin) ? addJqueryPluginToWebpackConfig() : noop(),
          addStyles(),
          addScripts(),
          installNodeDeps()
        ])),
      ])(host, context);
    } else {
      noop();
    }
  };
}
