"use strict";

module.exports = (app, models) => {
    app.use('/api', (req, res, next) => {
        if (req.user == null) {
            return res.status(401).end();
        } else {
            return next();
        }
    });

    app.get('/api/me', (req, res)=> {
        return res.json(req.user).end();
    });

    app.get('/api/me/avatar', (req, res) => {
        const id = req.user.oauthId;
        if (id.indexOf('cf-') === 0) {
            res.redirect('https://forum.craften.de/data/avatars/m/0/' + id.substr(3) + '.jpg').end();
        }
        res.status(404).end();
    });

    app.get('/api/modules', (req, res)=> {
        return res.json(req.user.snippets).end();
    });

    app.post('/api/modules', (req, res) => {
        if (req.user.snippets.find(function (s) {
                return s.name === req.body.name;
            }) == null) {
            let module = {
                name: req.body.name,
                code: req.body.code,
                blockly: req.body.blockly,
                lastModified: new Date()
            };
            req.user.snippets.push(module);
            req.user.markModified('snippets');
            return req.user.save().then(function () {
                return res.json(module).end();
            }).then(null, function () {
                return res.status(500).end();
            });
        } else {
            return res.status(409).end();
        }
    });

    app.put('/api/modules/:module', (req, res) => {
        let module = req.user.snippets.find(function (s) {
            return s.name === req.params.module;
        });
        let renamedModule = req.user.snippets.find(function (s) {
            return s.name === req.body.name;
        });
        if (module) {
            if ((renamedModule == null) || module === renamedModule) {
                module.name = req.body.name;
                module.code = req.body.code;
                module.blockly = req.body.blockly;
                module.lastModified = new Date();
                req.user.markModified('snippets');
                return req.user.save().then(function () {
                    return res.json(module).end();
                }).then(null, function () {
                    return res.status(500).end();
                });
            } else {
                return res.status(409).end();
            }
        } else {
            return res.status(404).end();
        }
    });

    app["delete"]('/api/modules/:module', (req, res) => {
        req.user.snippets = req.user.snippets.filter(function (s) {
            return s.name !== req.params.module;
        });
        req.user.markModified('snippets');
        return req.user.save().then(function () {
            return res.status(204).end();
        }).then(null, function () {
            return res.status(500).end();
        });
    });

    app.post('/logout', (req, res) => {
        req.logout();
        return res.redirect('/');
    });

    app.get('/modules/:username/:module', (req, res) => {
        return models.User.findOne({
            username: req.params.username
        }).then(function (user) {
            if (user != null) {
                let snippet = user.snippets.find(function (s) {
                    return s.name === req.params.module;
                });
                if (snippet) {
                    res.set({
                        'Content-Type': 'text/plain',
                        'Last-Modified': snippet.lastModified.toUTCString()
                    });
                    return res.send(snippet.code || '');
                } else {
                    return res.status(404).send();
                }
            } else {
                return res.status(404).send();
            }
        }).then(null, (err) => {
            console.log(err);
            return res.status(500);
        });
    });
};