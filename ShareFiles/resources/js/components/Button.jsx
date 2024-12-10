import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Button.css';

const Button = ({ text, onClick, className, disabled, type, variant }) => {
    return (
        <button
            type={type || 'button'}
            onClick={onClick}
            className={`button ${variant} ${className}`}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success'])
};

Button.defaultProps = {
    className: '',
    disabled: false,
    type: 'button',
    variant: 'primary'
};

export default Button;