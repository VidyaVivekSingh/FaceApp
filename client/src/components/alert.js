import React from 'react';
import { Alert } from 'reactstrap';

const ModifiedAlert = (props) => {
  return (
    <div>
      <Alert color={props.color}>
        <h4 className="alert-heading">{props.heading}</h4>
        <p>
        {props.message1}
        </p>
        <hr />
        {/* <p className="mb-0">
        {props.message2}
        </p> */}
      </Alert> 
    </div>
  );
};

export default ModifiedAlert;