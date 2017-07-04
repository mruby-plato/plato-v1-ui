// on select pane
function onPaneSelect(pane) {
  var tabs = ['general_ad', 'com_ad', 'dev_ad', 'ext_gem_ad'];
  for (var i=0; i<tabs.length; i++) {
    $('#nav_' + tabs[i]).removeClass('active');
    $('#pane_' + tabs[i]).css('display', 'none');
  }
  $('#nav_' + pane).addClass('nav-group-item active');
  $('#pane_' + pane).css('display', 'block');
}

// show gemlist table
function showGems(jsonpath, tbl_id, disp_maker, is_multiple) {
  $.getJSON(jsonpath , function(mgems, status) {
    if (status == 'success') {
      var len = mgems.mrbgems.length;
      var listname = (tbl_id.indexOf('dev') !== -1) ? 'devlist' : ((tbl_id.indexOf('ext') !== -1) ? 'extlist' : 'mgemlist');
      var tbody = $('<tbody>');

      for (var i=0; i<len; i++) {
        id = 'opt_' + mgems.mrbgems[i].name.replace(/-|\//g, '_');
        var newline = $('<tr>').attr('id', 'tr_lbl_' + id);
        var gemname = $('<td class="th25">');
        var chk = $('<input type="checkbox">').attr('id', id).attr('name', id).attr('data', mgems.mrbgems[i].name);
        var rdo = $('<input type="radio">').attr('id', id).attr('name', 'rdo' + tbl_id).attr('data', mgems.mrbgems[i].name).attr('checked', mgems.mrbgems[i].default);
        var lbl = $('<label class="' + listname + '">').attr('id', 'lbl_' + id).attr('for', id).text(mgems.mrbgems[i].name);
        var author_cell = $('<td class="th15">').attr('id', listname + '_author_' + i).text(mgems.mrbgems[i].author);
        var repository_cell = $('<td class="th05">').append($('<a>').attr('href', mgems.mrbgems[i].repository).attr('target', '_blank').append($('<span>').attr('class', 'icon icon-github')));
        var desc_cell = $('<td class="th40">').attr('id', listname + '_desc_' + i).attr('title', mgems.mrbgems[i].description).text(mgems.mrbgems[i].description);
        var maker_cell;

        gemname.append(is_multiple == true ? chk : rdo).append(lbl);
        if (disp_maker) {
          maker_cell = $('<td class="15">').text(mgems.mrbgems[i].maker);
          newline.append(gemname).append(maker_cell).append(author_cell);
        } else {
          newline.append(gemname).append(author_cell);
        }
        if (mgems.mrbgems[i].repository) {
          newline.append(desc_cell).append(repository_cell);
        }

        tbody.append(newline);
        all_gems.push(mgems.mrbgems[i]);
      }
      $('#' + tbl_id).append(tbody);
      // console.log(all_gems);
    } else {
      alert("Faild to load Json!");
    }
  });
}

function hasGems(gemlist, name) {
  for (var i=0; i<gemlist.length; i++) {
    if (gemlist[i] == name) {
      return true;
    }
  }
  return false;
}

function findGemByName(gemlist, name) {
  for (var i=0; i<gemlist.length; i++) {
    if (gemlist[i].name == name) {
      return gemlist[i];
    }
  }
  return null;
}

function traceDependency(gems, name) {
  var gem = findGemByName(all_gems, name);
  try {
    if (gem != null) {
      if (gem.dependencies != null) {
        // console.log(gem.dependencies);
        
        for (var i = 0; i < gem.dependencies.length; i++) {
          var dep_gem = findGemByName(all_gems, gem.dependencies[i].name);

          if (dep_gem == null) {
            throw new Error("mgem to stop the process for can not be found.[" + gem.dependencies[i].name + "]");
          }
          // console.log(dep_gem.name);
          if (traceDependency(gems, dep_gem.name)) {
            if (hasGems(gems, dep_gem.name) == false) {
              gems.push(dep_gem.name);
            }
          } else {
            throw new Error("mgem to stop the process for can not be found.[" + gem.dependencies[i].name + "]");
          }
        }
      }
    } else {
      throw new Error("mgem to stop the process for can not be found.[" + gem.dependencies[i].name + "]");
    }
  } catch (e) {
    console.log(e.message);
    alert(e.message);
    return false;
  }
  return true;
}

// simple search
function searchMgemList(val, listname) {
  var 
  i,
  id,
  name,description,author,
  lists,
  input_text = val;
  // console.log(listname);

  // get the mgem dom
  lists = document.querySelectorAll('.' + listname);

  for (i = 0; i < lists.length; i++){
    id = lists[i].id;
    // search name or author or description
    name = lists[i].innerText;
    author = $('#' + listname + '_author_' + i).text();
    description = $('#' + listname + '_desc_' + i).text();

    if (name.includes(input_text) || author.includes(input_text) || description.includes(input_text)){
      $('#tr_' + id).removeClass('hidden');
    } else {
      $('#tr_' + id).addClass('hidden');
    }
  }
};

// on click create button
function createAdvanced() {
  var appcfg = new Object();

  appcfg.target_board = $('input[name=adv_target_board]:checked').val(); // target board
  appcfg.option_board = new Array(); // option board
  appcfg.option_board.push({'model': $('input[name=adv_option_board]:checked').val()});
  appcfg.app_type = $('input[name=prjtype_type]:checked').val(); // application type
  appcfg.project = $('#adv_application_name').val(); // application name

  var gems = new Array();
  var selected = false;

  // console.log(all_gems);
  $('input[id^="opt_"]').each(function(i, elem) {
    if ($(elem).prop('checked')) {
      selected = true;

      if (traceDependency(gems, $(elem).attr('data'))) {
        if (hasGems(gems, $(elem).attr('data')) == false) {
          gems.push($(elem).attr('data'));
        }
      } else {
        return;
      }
      // console.log(i + ': ' + $('label[for=' + $(elem).attr('id') + ']').text());
    }
  });

  var appcfg = new Object();

  appcfg.target_board = $('input[name=adv_target_board]:checked').val(); // target board
  appcfg.option_board = new Array(); // option board
  appcfg.option_board.push({'model': $('input[name=adv_option_board]:checked').val()});
  appcfg.app_type = $('input[name=prjtype_type]:checked').val(); // application type
  appcfg.project = $('#adv_application_name').val(); // application name

  // Confirm generate
  var detail_app = MSG.APP_NAME + ': ' + $('#adv_application_name').val() + '\n';
  detail_app += MSG.TARG_BOARD + ': ' + $('input[name=adv_target_board]:checked').parents('label').text() + '\n';
  detail_app += MSG.OPT_BOARD + ': ';
  appcfg.option_board.forEach(function(ele, idx, target) {
    if (idx > 0) detail_app += ', '
    detail_app += $('input[name=adv_option_board]:checked').parents('label').text();
  });
  detail_app += '\n';
  detail_app += MSG.APP_TYPE + ': ' + $('input[name=prjtype_type]:checked').parents('label').text() + '\n';
  detail_app += MSG.LIBRARIES + ':\n';
  gems.forEach(function(ele, idx, target) {
    if (ele != 'none') detail_app += '  ' + ele + '\n';
  });

  var win = remote_app.getCurrentWindow();
  var options = {
    type: 'info',
    buttons: ['OK', 'Cancel'],
    title: MSG.CONF_APPL,
    message: MSG.CONF_GENERATE,
    detail: detail_app
  };
  if (dialog.showMessageBox(win, options) > 0) return;

  try {
    // generate application
    var mgem_list_path = path.join(getHomePath(), 'mgems.lst');
    fs.writeFileSync(mgem_list_path, gems.join("\n"), 'utf-8');
    var appcfg_path = path.join(getHomePath(), 'app.cfg');
    writeJSON(appcfg_path, appcfg);
    generateApplication(appcfg_path, mgem_list_path);
  } catch(e) {
    console.log(e.message);
    alert(e.message);
  }
}
