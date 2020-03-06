# cap-angular-schematic-bootstrap  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
 This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM. 
 
# Getting Started
 These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
* Have an Angular app 
install  npm 6.13.7 
```	
nmp install 
```
* [Node](https://nodejs.org/en/download/current) 10.6 to the current. 


## Installation
To run the schematic, execute the following command.
```
ng add cap-angular-schematic-bootstrap 
```


The schematic will be configurated after you answer the following questions.

* What is the Boostrap version that you need install? : < 4.0.0 default >
​
The Schematic check if Bootstrap is not configured in angular.json styles, if not install the specified package and update the angular.json, also add types for jquery and a plug-in for use jquery.

Touched files:

```
app
    |-- package.json
    |-- index.html
	|-- angular.json
	|-- webpack.server.config.js
```

## Usage
angular 8

## Built With
[Schematic](https://www.schematics.com/)

## Version 
1.0

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes -[cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-bootstrap)