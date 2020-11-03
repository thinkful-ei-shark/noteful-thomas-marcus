import React from "react";
import "./CircleButton.css";
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function CircleButton(props) {
  const { tag, className, childrenm, ...otherProps } = props;

  return React.createElement(
    props.tag,
    {
      className: ["NavCircleButton", props.className].join(" "),
      ...otherProps,
    },
    props.children
  );
}



// CircleButton.propTypes = {
//   children: PropTypes.array,
//   className: PropTypes.string,
//   onClick: PropTypes.func,
//   type: PropTypes.string,
//   tag: PropTypes.string,
// }

CircleButton.defaultProps = {
  tag: 'a',
};
