import React from 'react';

export const ErrorList = (props) => {
  if (props.children) {
    return <ul>
      {props.children.map((error,i) => {
        return <li key={i}>{error}</li>
      })}
    </ul>;
  } else {
    return null;
  }
};