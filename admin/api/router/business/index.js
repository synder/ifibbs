/**
 * @author synder
 * @date 16/1/10
 * @desc
 */




exports.map = function (app) {
    app.get('/test',function (req, res) {
        res.json({
            flag: '0000',
            msg:  '',
            result: {
                a:'test'
            }
        })
    })
};