const OS_WINDOWS  = 'Windows';
const OS_MAC      = 'Darwin';
const OS_LINUX    = 'Linux';

const TOOL_PROJECT_MAKER  = 'prjmaker.rb';

// Get OS type name
// 'Windows'/'Darwin'/'Linux'/'Unknown'
function getOSType() {
  var osTypeName = os.type().toString();
  var osTypes = [OS_WINDOWS, OS_MAC, OS_LINUX];
  var os_type = 'Unknown';
  osTypes.forEach(function(ele, idx, target) {
    if (osTypeName.match(ele)) os_type = ele;
  }); 
  return os_type;
}

// get Plato home path ($PLATO)
function getInstPath() {
  var os_type = getOSType();
  var home = (os_type == OS_WINDOWS) ? 'c:/' : remote_app.app.getPath('home');
  return home + '/plato';
}

// get Plato home path ($PLATO/.plato)
function getHomePath() {
  return getInstPath() + '/.plato';
}

// get Plato tools path ($PLATO/.plato/tools)
function getToolPath() {
  return  getHomePath() + '/tools';
}

// get Plato project base path ($PLATO/.plato/prjbase)
function getProjBasePath() {
  return  getHomePath() + '/prjbase';
}

// write JSON file
function writeJSON(file_path, json) {
  try {
    fs.writeFileSync(file_path, JSON.stringify(json), 'utf-8');
  } catch(e) {
    console.log(e.message);
    alert(e.message);
  }
}

// generate application and launch VSCode
function generateApplication(app_cfg, mgem_list) {
  try {
    var exec = require('child_process').exec;
    var cmd = 'ruby ' + getToolPath() + '/' + TOOL_PROJECT_MAKER + ' ' + app_cfg + ' ' + mgem_list;
    genApp = function() {
      return exec(cmd, {},
        function(error, stdout, stderr) {
          console.log('stdout: '+(stdout||'none'));
          console.log('stderr: '+(stderr||'none'));
          if(error !== null) {
            console.log('exec error: '+error);
          }
        }
      )
    };
    genApp();

  } catch(e) {
    console.log(e.message);
    alert(e.message);
  }
}

// validate empty
function checkEmpty(id, errmsg) {
  var val = $(id).val();
  if (val.length == 0) {
    alert(errmsg);
    $(id).focus();
    return false;
  }
  return true;
}
