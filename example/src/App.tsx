import {
  Button,
  createStyles,
  Drawer,
  List,
  ListItem,
  makeStyles,
  Theme
} from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import DynamicContent from './DynamicContent';

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
      height: '100vh',
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3)
    }
  })
);

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
            </Route>
            <Route path='/users'>
              <Users />
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
