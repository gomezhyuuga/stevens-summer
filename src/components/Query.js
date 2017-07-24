import React from 'react'
import brace from 'brace'
import AceEditor from 'react-ace'

import 'brace/mode/mysql';
import 'brace/theme/tomorrow_night_eighties';

class Query extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AceEditor
        mode="mysql"
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
