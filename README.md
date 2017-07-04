# plato-ui

## Install build tools

To clone and make this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Ruby](https://www.ruby-lang.org/) installed on your computer.

## Install electron-packager

```bash
npm install electron-packager -g
```

## Make plato-ui

### Windows
```bash
$ cd plato-ui
$ ruby build.rb [en|ja] # en:English, ja:Japanese, none:Both.
```

### Mac
- Pre-build package (1st time only)  
Add below code to '~/.bash_profile'
```
export NODE_PATH=`npm root -g`
```
- Make package
```bash
$ cd plato-ui
$ ruby build.rb [en|ja] # en:English, ja:Japanese, none:Both.
```

#### License [MIT](LICENSE.md)
