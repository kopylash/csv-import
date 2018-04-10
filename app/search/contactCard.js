'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent} from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const ContactCard = (props) => {
  const {name, age, address, team, classes} = props;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title}>Contact</Typography>
        <Typography variant="headline" component="p">{name}</Typography>
        <Typography className={classes.pos}>
          {team.toUpperCase()}, {age}
        </Typography>
        <Typography component="p" color="textSecondary">{address}</Typography>
      </CardContent>
    </Card>
  );
};

ContactCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  team: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

const styles = {
  card: {
    minWidth: 275,
    marginTop: 15
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
};

export default withStyles(styles)(ContactCard);
