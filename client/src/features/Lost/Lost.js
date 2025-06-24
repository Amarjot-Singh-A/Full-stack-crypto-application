import React from 'react';
import { Link } from 'react-router-dom';

export default function Lost() {
  return (
    <div>
      <h2> Looks like you are lost </h2>
      <Link to="/">Sign In</Link>
    </div>
  );
}
