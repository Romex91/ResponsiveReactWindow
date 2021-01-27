import {
  createStyles,
  Drawer,
  List,
  ListItem,
  makeStyles,
  Theme
} from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DynamicContent from './examples/DynamicContent';

import { Controlled as CodeMirror } from 'react-codemirror2';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),

      [theme.breakpoints.up('md')]: {
        display: 'flex',
        height: '100vh'
      }
    }
  })
);

function Code(props: { fileName: string }) {
  const [value, setValue] = React.useState('');
  React.useEffect(() => {
    (async () => {
      const content = await fetch(
        process.env.PUBLIC_URL + 'examples/' + props.fileName
      );
      setValue(await content.text());
    })();
  }, []);

  return (
    <CodeMirror
      value={value}
      options={{
        mode: { name: 'jsx', base: { name: 'javascript', typescript: true } },
        lineNumbers: true
      }}
      onBeforeChange={() => {}}
      onChange={() => {}}
    />
  );
}

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          open={true}
          classes={{
            paper: classes.drawerPaper
          }}
          anchor='left'
        >
          <List>
            <ListItem>
              <Link to='/'>Home</Link>
            </ListItem>
            <ListItem>
              <Link to='/DynamicContent'>Items Can Resize</Link>
            </ListItem>
            <ListItem>
              <Link to='/users'>Users</Link>
            </ListItem>
          </List>
        </Drawer>

        <main className={classes.content}>
          <Switch>
            <Route path='/DynamicContent'>
              <DynamicContent />
              <Code fileName={'DynamicContent.tsx'}></Code>
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
