// on click next or back button
function changePane(pane) {
  if (pane == 'dev' && $('#application_name').val().length == 0) {
    alert(MSG.NO_APP_NAME); //'Please enter an application name.''
    $('#application_name').focus();
    return false;
  }

  if (pane == 'dev') {
    pane = ($('input[id=app_sensortrigger]:checked').val()) ? 'trigger' : 'server';
  }

  var tabs = ['general', 'trigger', 'server'];
  for (var i=0; i<tabs.length; i++) {
    $('#pane_' + tabs[i]).css('display', 'none');
  }
  $('#pane_' + pane).css('display', 'block');
  if (pane != 'general') {
    $('#back_button').focus();
    $('#sensing_period').focus();
  }
}

// on change sensor
function sensorOnChange(val) {
  if (val == 'tmp') {
    $('.unit1').removeClass('hidden');
    $('.unit2').addClass('hidden');
    $('.unit3').addClass('hidden');
    $('.unit4').addClass('hidden');
    $('.op').removeClass('hidden');
  } else if (val == 'hum') {
    $('.unit1').addClass('hidden');
    $('.unit2').removeClass('hidden');
    $('.unit3').addClass('hidden');
    $('.unit4').addClass('hidden');
    $('.op').removeClass('hidden');
  } else if (val == 'lx') {
    $('.unit1').addClass('hidden');
    $('.unit2').addClass('hidden');
    $('.unit3').removeClass('hidden');
    $('.unit4').addClass('hidden');
    $('.op').removeClass('hidden');
  } else if (val == 'tim') {
    $('.unit1').addClass('hidden');
    $('.unit2').addClass('hidden');
    $('.unit3').addClass('hidden');
    $('.unit4').removeClass('hidden');
    $('.op').addClass('hidden');
  }
}

function opOnChange(val) {
  if (val == 'last') {
    $('#server_time_value').show();
  } else {
    $('#server_time_value').hide();
    if ($('input[name=server_sensor_rdo]:checked').val() == 'tim') {
      $('input[name=server_sensor_rdo]:eq(0)').prop('checked', true);
      sensorOnChange('tmp');
    }
  }
}

// add send data
function addSendValue() {
  var linetext = '';
  var val = new Object();

  if ($('#server_param').children().length > 0) { // show AND
    linetext += (lang_id == 'en' ? 'AND ' : 'と ');
  }

  if (lang_id == 'en') {
    linetext += $('input[name=server_op]:checked').parents('label').text();
    linetext += ' ';
  }

  linetext += $('input[name=server_sensor_rdo]:checked').parents('label').text();
  linetext += '(';

  val.key = $('input[name=server_sensor_rdo]:checked').val();
  // val.value = $('#trigger_value').val();

  if (val.key == 'tmp') {
    linetext += $('input[name=server_unit1]:checked').parents('label').text();
    val.unit = $('input[name=server_unit1]:checked').val();
    val.eval = '@temp';
    val.title = 'temperature';
  } else if (val.key == 'hum') {
    linetext += $('input[name=server_unit2]:checked').parents('label').text();
    val.unit = $('input[name=server_unit2]:checked').val();
    val.eval = '@humi';
    val.title = 'humidity';
  } else if (val.key == 'lx') {
    linetext += $('input[name=server_unit3]:checked').parents('label').text();
    val.unit = $('input[name=server_unit3]:checked').val();
    val.eval = '@illu';
    val.title = 'illuminance';
  } else if (val.key == 'tim') {
    linetext += $('input[name=server_unit4]:checked').parents('label').text();
    val.unit = $('input[name=server_unit4]:checked').val();
    val.eval = 'time';
    val.title = 'datetime';
  }

  linetext += ')';

  if (val.key != 'tim') {
    val.operator = $('input[name=server_op]:checked').val();
    if (lang_id == 'ja') {
      linetext += $('input[name=server_op]:checked').parents('label').text();
    }
    val.eval += '.';
    val.eval += val.operator;
  }

  $('#server_param').append($('<option>').attr('value', JSON.stringify(val)).text(linetext));
}

// delete selected sensor value
function deleteSendValue() {
  var index = $('#server_param').prop('selectedIndex');

  if (index < 0) return;

  $('#server_param').children('option:eq(' + index +')').remove();
  if ($('#server_param').children().length == 0) return;

  var option = $('#server_param').children()[0];
  var values = JSON.parse(option.value);

  option.text = option.text.replace(/^(AND|と)\s/, '');
  option.value = JSON.stringify(values);
}

// add trigger condition
function addTriggerCondition() {
  var linetext = '';
  var val = new Object();

  if (checkTriggerParam()) {
  } else {
    return;
  }

  if (setCondition) {
    linetext = $('input[name=trigger_andor_rdo]:checked').parents('label').text();
    val.and_or = $('input[name=trigger_andor_rdo]:checked').val();
  }
  linetext += ' ' + $('input[name=trigger_sensor_rdo]:checked').parents('label').text();
  if (lang_id == 'en') {
    linetext += ' ' + $('input[name=trigger_op]:checked').parents('label').text();
  }
  linetext += ' ' + $('#trigger_value').val();
  
  val.key = $('input[name=trigger_sensor_rdo]:checked').val();
  val.value = $('#trigger_value').val();

  if (val.key == 'tmp') {
    linetext += $('input[name=trigger_unit1]:checked').parents('label').text();
    val.unit = $('input[name=trigger_unit1]:checked').val();
  } else if (val.key == 'hum') {
    linetext += $('input[name=trigger_unit2]:checked').parents('label').text();
    val.unit = $('input[name=trigger_unit2]:checked').val();
  } else if (val.key == 'lx') {
    linetext += $('input[name=trigger_unit3]:checked').parents('label').text();
    val.unit = $('input[name=trigger_unit3]:checked').val();
  }
  val.operator = $('input[name=trigger_op]:checked').val();
  if (lang_id != 'en') {
    linetext += ' ' + $('input[name=trigger_op]:checked').parents('label').text();
  }

  $('#trigger_param').append($('<option>').attr('value', JSON.stringify(val)).text(linetext));
  
  setCondition = true;
  $('input[name=trigger_andor_rdo]').attr('disabled', false);
}

// delete selected trigger condition
function deleteTriggerCondition() {
  var index = $('#trigger_param').prop('selectedIndex');

  if (index < 0) {
    return;
  } else {

    $('#trigger_param').children('option:eq(' + index +')').remove();
    if ($('#trigger_param').children().length == 0) { // disable AND OR
      setCondition = false;
      $('input[name=trigger_andor_rdo]').attr('disabled', 'disabled');
    } else { // remove AND OR
      var option = $('#trigger_param').children()[0];
      var values = JSON.parse(option.value);

      if (values.and_or != undefined) {
        option.text = option.text.replace(/^(AND|OR|かつ|または)\s/, '');
        delete values.and_or;
        option.value = JSON.stringify(values);
      }
    }

  }
}

// validate sensor params
function checkTriggerParam() {
  // validate sensing period
  var val = $('#sensing_period').val();
  if (val.length == 0 || !$.isNumeric(val) || val < 1) {
    alert(MSG.SEN_PER_1_MORE);  //'The sensing period Enter greater than or equal to one.'
    $('#sensing_period').focus();
    return false;
  }

  //　validate sensor value
  val = $('#trigger_value').val();
  if (val.length > 0) {
    var sensor_type = $('input[name=trigger_sensor_rdo]:checked').val();

    if (sensor_type == 'tmp') {
      if ($.isNumeric(val)) {
      } else {
        alert(MSG.TEMP_INT);  //'Please enter a numeric value to the temperature.'
        $('#trigger_value').focus();
        return false;
      }
    } else if (sensor_type == 'hum') {
      if ($.isNumeric(val) && parseFloat(val) > 0) {
      } else {
        alert(MSG.HUMI_0_MORE); //'The humidity should be input greater than or equal to zero.'
        $('#trigger_value').focus();
        return false;
      }
    } else if (sensor_type == 'lx') {
      if ($.isNumeric(val) && parseFloat(val) > 0) {
      } else {
        alert(MSG.ILLU_0_MORE); //'The illumination enter greater than or equal to zero.'
        $('#trigger_value').focus();
        return false;
      }
    }
  } else {
    return false;
  }

  return true;
}

// validate time string
function checkTime(str) {
  if(!str.match(/^\d{2}\:\d{2}:\d{2}$/)){
    return false;
  }
  var vHour = str.substr(0, 2) - 0;
  var vMinutes = str.substr(3, 2) - 0;
  var vSeconds = str.substr(6, 2) - 0;
  if(vHour >= 0 && vHour <= 23 && vMinutes >= 0 && vMinutes <= 59 && vSeconds >= 0 && vSeconds <= 59){
    return true;
  }else{
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

// on click create button (sensor trigger)
function createRapid() {
  // validate sensing period
  var val = $('#sensing_period').val();
  if (val.length == 0 || !$.isNumeric(val) || val < 1) {
    alert(MSG.SEN_PER_1_MORE);  //'The sensing period Enter greater than or equal to one.'
    $('#sensing_period').focus();
    return false;
  }

  // conditions
  if ($('#trigger_param').children().length == 0) {
    alert(MSG.NO_TRIGGER);  //'Please set trigger conditions.'
    return false;
  }

  var action_type = $('input[name=trigger_action]:checked').val();
  if (action_type == 'ifttt') {
    // validate IFTTT event/key
    if (!checkEmpty('#ifttt_event', MSG.NO_IFT_EVT) ||
        !checkEmpty('#ifttt_key',   MSG.NO_IFT_KEY)) {
      return false;
    }
  } else if (action_type == 'action_script') {
    // validate free text
    if (!checkEmpty('#action_script_value', MSG.NO_SCRIPT)) {
      return false;
    }
  }

  //　validate interval
  var continuous = $('input[name=trigger_continuous]:checked').val();
  if (continuous == 'true') {
    val = $('#trigger_interval').val();
    if ($.isNumeric(val) && parseFloat(val) > 0) {
    } else {
      alert(MSG.TRI_PER_0_MORE);  //'Please enter a number greater than 0 to the interval.'
      $('#trigger_interval').focus();
      return false;
    }
  }

  var appcfg = new Object();

  appcfg.target_board = $('input[name=rap_target_board]:checked').val(); // target board
  appcfg.option_board = new Array(); // option board
  appcfg.option_board.push({'model': $('input[name=rap_option_board]:checked').val()});
  appcfg.app_type = $('input[name=rap_app_type]:checked').val(); // application type
  appcfg.project = $('#application_name').val(); // application name
  appcfg.com_dev = $('input[name=com_type]:checked').val(); // nw device type
  appcfg.com_para = new Array(); // nw device params
  appcfg.sensing_period = $('#sensing_period').val(); // sensing period
  appcfg.trigger = new Array(); // trigger params
  $('#trigger_param').children().each(function(i, elem) {
    appcfg.trigger.push(JSON.parse($(elem).val()));
  });
  appcfg.action = {
    "continuous" : $('input[name=trigger_continuous]:checked').val().toString()
  , "interval" : $('#trigger_interval').val()
  , "action_type" : $('input[name=trigger_action]:checked').val()
  , "ifttt_event" : $('#ifttt_event').val().toString()
  , "ifttt_key" : $('#ifttt_key').val().toString()
  , "gpio_pin" : $('#gpio_pin').val().toString()
  , "gpio_value" : $('#gpio_value').val().toString()
  , "gpio_not_occur" : ($('#gpio_not_occur').prop('checked') ? "1" : "0")
  , "action_script" : $('#action_script_value').val()
  , "data_type" : "JSON"
  , "values" : [{"value1": "time"}, {"value2": "temperature"}, {"value3": "humidity"}] // sample
  }; // action
  
  // generate application (sensor trigger) 
  var appcfg_path = path.join(getHomePath(), 'app.cfg');
  var mgem_list_path = path.join(getProjBasePath(), 'rapid-mrbgems.lst');
  writeJSON(appcfg_path, appcfg);
  generateApplication(appcfg_path, mgem_list_path);
}

// on click create button (send to server)
function createRapidServer() {
  // validate sensing period
  var val = $('#sensing_period_server').val();
  if (val.length == 0 || !$.isNumeric(val) || val < 1) {
    alert(MSG.SEN_PER_1_MORE);  //'The sensing period Enter greater than or equal to one.'
    $('#sensing_period_server').focus();
    return false;
  }

  // validate send period
  var val = $('#send_period').val();
  if (val.length == 0 || !$.isNumeric(val) || val < 1) {
    alert(MSG.SND_PER_1_MORE);  //'The send period Enter greater than or equal to one.'
    $('#send_period').focus();
    return false;
  }

  // data list
  if ($('#server_param').children().length == 0) {
      alert(MSG.NO_SEND_DATA);  //'Please select values that send to the server.'
      return false;
  }

  var action_type = $('input[name=server_action]:checked').val();
  if (action_type == 'ifttt') {
    // validate IFTTT event/key
    if (!checkEmpty('#ifttt_event_server', MSG.NO_IFT_EVT) ||
        !checkEmpty('#ifttt_key_server',   MSG.NO_IFT_KEY)) {
      return false;
    }
  }
  else if (action_type == 'blocks') {
    // validate MAGELLAN BLOCKS parameters
    if (!checkEmpty('#blocks_entry_point', MSG.NO_BLK_ENT) ||
        !checkEmpty('#blocks_project_id',  MSG.NO_BLK_PID) ||
        !checkEmpty('#blocks_api_token',   MSG.NO_BLK_KEY) ||
        !checkEmpty('#blocks_msg_type',    MSG.NO_BLK_MTY)) {
      return false;
    }
  }
  else if (action_type == 'action_script') {
    // validate free text
    if (!checkEmpty('#server_action_script_value', MSG.NO_SCRIPT)) {
      return false;
    }
  }

  // create app.cfg
  var appcfg = new Object();

  appcfg.target_board = $('input[name=rap_target_board]:checked').val(); // target board
  appcfg.option_board = new Array(); // option board
  appcfg.option_board.push({'model': $('input[name=rap_option_board]:checked').val()});
  appcfg.app_type = $('input[name=rap_app_type]:checked').val(); // application type
  appcfg.project = $('#application_name').val(); // application name
  appcfg.com_dev = $('input[name=com_type]:checked').val(); // nw device type
  appcfg.com_para = new Array(); // nw device params
  appcfg.sensing_period = $('#sensing_period_server').val(); // sensing period
  appcfg.send_period = $('#send_period').val(); // send period
  var values = new Array();
  $('#server_param').children().each(function(i, elem) {
    var val = JSON.parse($(elem).val());
    var item = new Object();
    item.value = val.eval;
    item.title = val.title;
    values.push(item);
  });

  appcfg.action = {
    "action_type" : $('input[name=server_action]:checked').val()
  , "ifttt_event" : $('#ifttt_event_server').val().toString()
  , "ifttt_key" : $('#ifttt_key_server').val().toString()
  , "blocks_entry" : $('#blocks_entry_point').val().toString()
  , "blocks_prjid" : $('#blocks_project_id').val().toString()
  , "blocks_token" : $('#blocks_api_token').val().toString()
  , "blocks_msgtyp" : $('#blocks_msg_type').val().toString()
  , "blocks_devinfo" : $('#blocks_dev_info').val().toString()
  , "action_script" : $('#server_action_script_value').val()
  , "data_type" : "JSON"
  }; // action
  appcfg.action.values = new Array();
  for (var i=0; i<values.length; i++) {
    appcfg.action.values[i] = new Object();
    appcfg.action.values[i].value = values[i].value;
    appcfg.action.values[i].title = values[i].title;
  }

  // generate application (send to server) 
  var appcfg_path = path.join(getHomePath(), 'app.cfg');
  var mgem_list_path = path.join(getProjBasePath(), 'rapid-mrbgems.lst');
  writeJSON(appcfg_path, appcfg);
  generateApplication(appcfg_path, mgem_list_path);

  return true;
}

// Change digital value HIGH/LOW
function changeGPIOValue(){
  var hl = $('#gpio_value').val();
  $('#gpio_not_value').html((hl == 0) ? "HIGH" : "LOW");
}

// Change trigger action
function changeTriggerAction(){
  var action_type = $('input[name=trigger_action]:checked').val();

  // Hide all parameters
  $('#trigger_ifttt_param').hide();
  $('#trigger_gpio_param').hide();
  // Show selected action parameters
  switch(action_type){
  case 'ifttt':
    $('#trigger_ifttt_param').show();
    break;
  case 'gpio_out':
    $('#trigger_gpio_param').show();
    break;
  default: break;
  }
}

// Change server action
function changeServerAction(){
  var action_type = $('input[name=server_action]:checked').val();

  // Hide all parameters
  $('#server_ifttt_param').hide();
  $('#server_blocks_param').hide();
  // Show selected action parameters
  switch(action_type){
  case 'ifttt':
    $('#server_ifttt_param').show();
    break;
  case 'blocks':
    $('#server_blocks_param').show();
    break;
  default: break;
  }
}

function changeBlocksURL(){
  var entry = $('#blocks_entry_point').val();
  var prjid = $('#blocks_project_id').val();

  if (!entry) entry = "<Entry Point>";
  if (!prjid) prjid = "<Project ID>";

  $('#blocks_url').text("http://magellan-iot-" + entry + "-dot-" + prjid + ".appspot.com");
  $('#blocks_url').css("color", "gray");
}
