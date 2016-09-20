var $folderList = $('#folder_list');
var templates = {
  folder: template('folder')
};

var data = Fliplet.Widget.getData() || {};

function getFolder() {
  Fliplet.Media.Folders.get({
    appId: Fliplet.Env.get('appId')
  }).then(function (response) {
    if (response.folders.length === 0) {
      Fliplet.Apps.get( Fliplet.Env.get('appId') ).then(function (apps) {
        apps.forEach(addFolder);
      });
    } else {
      response.folders.forEach(addFolder);
    }
  });
}

// Adds folder item template
function addFolder(folder) {
  $folderList.append(templates.folder(folder));
}

// Templating
function template(name) {
  return Handlebars.compile($('#template-' + name).html());
}

// 1. Fired from Fliplet Studio when the external save button is clicked
Fliplet.Widget.onSaveRequest(function () {
  $('form').submit();
});

// 2. Fired when the user submits the form
$('form').submit(function (event) {
  event.preventDefault();
  save(true);
});

function save(notifyComplete) {
  data.folderID = $('#folder_list option:selected').val();

  Fliplet.Widget.save(data).then(function () {
    if (notifyComplete) {
      Fliplet.Widget.complete();
      window.location.reload();
    }
  });
}

$('#folder_list').on('change', function() {
  var selectedValue = $(this).val();
  var selectedText = $(this).find("option:selected").text();
  $('.section.show').removeClass('show');
  $('#' + selectedValue + 'Section').addClass('show');
  $(this).parents('.select-proxy-display').find('.select-value-proxy').html(selectedText);
});

$('#help_tip').on('click', function() {
  alert("During beta, please use live chat and let us know what you need help with.");
});

getFolder();
