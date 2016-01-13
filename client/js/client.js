var ace = require('brace');
require('brace/mode/lua');
require('brace/theme/tomorrow_night');

var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/lua");
editor.setTheme("ace/theme/tomorrow_night");
