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
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.onQuery === nextProps.onQuery);
  }

  render() {
    console.log('Rendering AceEditor...');
    return (
      <AceEditor
        ref={ (c) => this._ace = c }
        mode="mysql"
        defaultValue='[operatingSystemCode = "WIN" ]'
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
