import React from 'react';
import { render } from 'react-dom';

import Test1 from './test1';
import Test2 from './test2';

render(
  <div>
    Hello react!
    <Test1 />
    <Test2 />
    <Test2 />
    <Test2 />
  </div>,
  document.getElementById('root')
);
