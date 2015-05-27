module.exports = function (app) {
    
    var source = app.dataSources.mysqlDs;
    
    //Models will be synced or created in this order
    var models = [
        //'User',
        'AccessToken',
        'ACL',
        'RoleMapping',
        'Role',
        'category',
        'filter',
        'banner'
    ];
    
    console.log('\n\n[Boot]: Syncing '+models.length+' models...');

    models.forEach(function (modelName) { 

        source.discoverModelProperties(modelName, function (err, props) {
            if (err) {
                console.log(err);
                //Table does not exist, create table
                source.automigrate(modelName, function (err) {
                    if (err) throw err;
                    console.log(modelName+' table created');
                });
            } else {
                //Table found, update table columns to fit model
                syncModel(source, modelName);
            }
        });    
    });
};


function syncModel(source, modelName) { 
    source.autoupdate(modelName, function (err, results) {
        if (err) throw err;
        console.log(modelName + ' synced');
    });
}