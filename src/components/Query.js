import React from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/mysql';
import 'brace/theme/tomorrow_night_eighties';

class Query extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const Ace = this._ace;
    const editor = Ace.editor;
    editor.commands.addCommand({
      name: 'myCommand',
      bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
      exec: (editor) => this.props.onQuery(editor.getValue())
    });
  }

  render() {
    return (
      <AceEditor
        ref={ (c) => this._ace = c }
        mode="mysql"
        defaultValue='label = "index" && code = 20'
        theme="tomorrow_night_eighties"
        width="100%"
        height="60px"
        fontSize={16}
        name="query"
        showGutter={false}
        editorProps={{$blockScrolling: true}}
      />
    );
  }
}

export default Query;
