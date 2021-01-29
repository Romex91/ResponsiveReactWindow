import {
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DynamicContent from './examples/DynamicContent';
import BasicUsage from './examples/BasicUsage';

import { Controlled as CodeMirror } from 'react-codemirror2';
import Horizontal from './examples/Horizontal';
import ScrollToItem from './examples/ScrollToItem';

const drawerWidth = 160;

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
  }, [props.fileName]);

  return (
    <CodeMirror
      value={value}
      options={{
        mode: { name: 'jsx', base: { name: 'javascript', typescript: true } },
        lineNumbers: false
      }}
      onBeforeChange={() => {}}
      onChange={() => {}}
    />
  );
}

function DragByTheCornerToResize() {
  return (
    <Typography variant='h6' color='secondary' align='right'>
      Drag by the corner to resize.
    </Typography>
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
              <Link to='/'>
                <Typography>Basic usage</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Link to='/ScrollToItem'>
                <Typography>Scroll to specific item</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Link to='/DynamicContent'>
                <Typography>Items can resize</Typography>
              </Link>
            </ListItem>
            <Divider></Divider>
            <ListItem>
              <Typography variant='h6'>Advanced:</Typography>
            </ListItem>
            <ListItem>
              <Link to='/ResponsiveTable'>
                <Typography>Responsive table</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Link to='/Horizontal'>
                <Typography>Horizontal</Typography>
              </Link>
            </ListItem>
          </List>
        </Drawer>

        <main className={classes.content}>
          <Switch>
            <Route path='/DynamicContent'>
              <div>
                <DynamicContent />
                <DragByTheCornerToResize />
              </div>
              <Code fileName={'DynamicContent.jsx'}></Code>
            </Route>
            <Route path='/Horizontal'>
              <div>
                <Horizontal />
                <DragByTheCornerToResize />
              </div>
              <Code fileName={'Horizontal.jsx'}></Code>
            </Route>
            <Route path='/ScrollToItem'>
              <div>
                <ScrollToItem />
                <DragByTheCornerToResize />
              </div>

              <Code fileName={'ScrollToItem.jsx'}></Code>
            </Route>
            <Route path='/'>
              <div>
                <BasicUsage />
                <DragByTheCornerToResize />
              </div>
              <Code fileName={'BasicUsage.jsx'}></Code>
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}
