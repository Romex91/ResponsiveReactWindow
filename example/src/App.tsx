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
import ResponsiveTable from './examples/ResponsiveTable';

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
        '& >div': {
          flex: 1
        },
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
    <Typography variant='h6' color='secondary' align='center'>
      Drag by the corner to resize.
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router basename='responsive-react-window'>
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
              <div style={{ width: '100%' }}>
                <Typography variant='h6'>
                  This code is similar to <Link to='/'>Basic usage</Link>. It
                  just has more sofisticated items.
                </Typography>

                <Code fileName={'DynamicContent.jsx'}></Code>
              </div>
            </Route>
            <Route path='/Horizontal'>
              <div>
                <Horizontal />
                <DragByTheCornerToResize />
              </div>
              <div style={{ width: '100%' }}>
                <Typography variant='h6'>
                  The horizontal responsive scrollbar is ridiculously hard to
                  implement in CSS. The code below has to have bugs, use it at
                  your own risk.
                </Typography>

                <Code fileName={'Horizontal.jsx'}></Code>
              </div>
            </Route>
            <Route path='/ResponsiveTable'>
              <div>
                <ResponsiveTable />
                <Typography variant='h6' style={{ margin: 20 }}>
                  You can customize every html element by using{' '}
                  <Typography
                    variant='inherit'
                    display='inline'
                    color='primary'
                  >
                    CustomReactWindow
                  </Typography>
                  :
                </Typography>
                <Code fileName={'ResponsiveTable.jsx'}></Code>
              </div>
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
