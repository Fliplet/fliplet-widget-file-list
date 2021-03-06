var data = Fliplet.Widget.getData($('[data-file-list-id]').data('file-list-id'));

var $listHolder = $('#list-holder');
var templates = {
    list: template('list')
};

function template(name) {
    return Handlebars.compile($('#template-' + name).html());
}

var currentFiles;

function getFolderContents(id) {
  $('#search-wrapper').attr('data-mode', 'loading');
  $('#search-screen').addClass('loading');

  currentFiles = [];
  $listHolder.html('');

  Fliplet.Media.Folders.get({
      appId: data.appID,
      folderId: data.folderID
  }).then(function (response) {
    if (!response.files.length) {
      response.files.push({
        id: 0,
        name: 'No files available in the selected folder',
        url: 'sample.pdf'
      });
    }
    response.files.forEach(addFile);
  });
}

// Adds file item template
function addFile(file) {
  // Converts to readable date format
  file.updatedAt = moment(file.updatedAt).format("Do MMM YYYY");

  currentFiles.push(file);
  $listHolder.append(templates.list(file));

  $('#search-wrapper').attr('data-mode', 'default');
  $('#search-screen').removeClass('loading');
  $('.list').attr('data-view', 'default');
  if ( !$('#first-load').hasClass('hidden') ) {
    $('#first-load').addClass('hidden');
  }
}

// Network states
if ( Fliplet.Navigator.isOnline() ) {
  if ( data != undefined ) {
    if ( $('#offline-notification').hasClass('show') ) {
      $('#offline-notification').removeClass('show');
      $('#offline-screen').removeClass('show');
      $('.list').removeClass('hidden');
    }
    getFolderContents();
  }
} else {
  $('#offline-notification').addClass('show');
  $('#offline-screen').addClass('show');
  $('.list').addClass('hidden');
  $('#first-load').addClass('hidden');
}

// EVENTS
$('.list')
  .on('click', '#list-holder li', function() {
    var fileURL = $(this).attr('data-file-url');

    if ( fileURL != undefined ) {
      window.open(fileURL, '_blank');
    }
  });

/*
BACK BUTTON AND SEARCH
$("#back-btn").on("click", function() {
  $('#search-screen').addClass('loading');
  $('#search-wrapper').attr('data-mode', 'loading');
  folderStack.pop();
  displayFolderFiles(folderStack[folderStack.length - 1], "back");
});

$("#search-search").on("click", function() {
  $('#search-screen').addClass('loading');
  displaySearchResults();
});

$('#directory-search').on( 'submit', function(e){
e.preventDefault();
      displaySearchResults();
});

$('#search-clear').on('click', function() {
  $('#search-screen').addClass('loading');
  $('#search-wrapper').attr('data-mode', 'loading');
  $('#search').val('');
  displayFolderFiles(folderStack[folderStack.length - 1], "clear");
});

$('#search').on('click focus', function() {
  if ( $('#search-wrapper').attr('data-mode') === "default" ) {
  	var buttonsWidth = $('#search-btn').outerWidth();
  	var searchBarWidth = $('#search').outerWidth();
  	var newSearchBarWidth = searchBarWidth - buttonsWidth;

  	$('#search-wrapper').attr('data-mode', 'search');
  	$('#search').css('width', newSearchBarWidth);
  }
});

$('#search-cancel, #search-screen').on('click', function() {
  if( $('#search-wrapper').attr('data-mode') === "search" ) {
	  $('#search-wrapper').attr('data-mode', 'default');
	  $('#search').css('width', '');
  }
});
*/
