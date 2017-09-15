var request = require('superagent-use')(require('superagent'))
var jsonFile = require('jsonfile')

var filename = './askchief/response.json'

exports.searchQuery = (data, printfn) => {
    if (!data.text && data.message.text) {
        data.text = data.message.text
    }
    if (!data.text.includes('find')) 
        return data

    var from = 0
    var to = 3
    if(data.text.includes('$f'))
        from = parseInt(data.text.charAt(data.text.indexOf('$f') + 1))
    if(data.text.includes('$t'))
        from = parseInt(data.text.charAt(data.text.indexOf('$t') + 1))

    data.text = data.text.replace('find ', '')
    data.promise = new Promise( (resolve, reject) => 
        request
            .get('https://api.edamam.com/search')
            .query({
                app_id : 'f8b028c6',
                app_key : '1e32bf188624756aa2d85474ce8c2c3a',
                q : data.text,
                from : 0,
                to : 3
            })
            .end(function(err, res) {
                jsonFile.writeFileSync(filename, res.body, {spaces:2})
                if (err) {
                    data.text = 'Sorry, couldn\'t fetch results from server. Try again later!'
                } else {
                    data.messages = []
                    var messages = data.messages
                    var receipts = res.body['hits']

                    receipts.forEach(element => {
                        var recipe = element['recipe']
                        var message = { source: '', text : '', photo : '' }
                        message['source'] = recipe['source']
                        message['text'] = "[" + recipe['source'] + "]" + "(" + recipe['url'] + ")" + "\n"
                        recipe['ingredientLines'].forEach(ingredient => {
                            message['text'] += ingredient + '\n'
                        }, this)
                        message['photo'] = recipe['image']
                        messages.push(message)
                    }, this);
                }
                printfn.call(this, data)

                resolve()
            }
    ))
    return data
}