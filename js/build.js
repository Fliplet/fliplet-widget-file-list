var templates = {
    file: template('file'),
    folder: template('folder'),
    folderItem: template('folder-item')
};
var $folderContents = $('.file-table-body'),
    organizationId;

function template(name) {
    return Handlebars.compile($('#template-' + name).html());
}

var folder = 9;
Fliplet.Apps.get().then(function(apps){
    var app = _.find(apps, {id : Fliplet.Env.get('appId')});
    organizationId = app.organizationId;
    getFolderContents(folder);

});

$('.file-manager-filelist').on('click', '.file-table-body [data-browse-folder]', function (event) {
    getFolderContents($(this).parents('.file-row').attr('data-id'));
});


function getFolderContents(currentFolderId) {

    currentFolders = [];
    currentFiles = [];
    $folderContents.html('');

    Fliplet.Media.Folders.get({
        organizationId: organizationId,
        folderId: currentFolderId
    }).then(function (response) {
        response.folders.forEach(addFolder);
        response.files.forEach(addFile);
    });
}

// Adds folder item template
function addFolder(folder) {

    // Converts to readable date format
    folder.updatedAt = moment(folder.updatedAt).format("Do MMM YYYY");

    currentFolders.push(folder);
    $folderContents.append(templates.folder(folder));
}

// Adds file item template
function addFile(file) {
    // Converts to readable date format

    file.updatedAt = moment(file.updatedAt).format("Do MMM YYYY");

    currentFiles.push(file);
    $folderContents.append(templates.file(file));
}


// Network states
document.addEventListener("offline", function(){

}, false);
document.addEventListener("online", function(){

}, false);