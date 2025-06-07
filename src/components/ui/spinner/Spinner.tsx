import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type SpinnerProps = {
	type?: keyof typeof Spinners;
	className?: string;
};

const Spinners = {
	default: <FontAwesomeIcon icon={faSpinner} spin />,
};

function Spinner({ type = 'default', className }: SpinnerProps) {
	return <i className={className}>{Spinners[type]}</i>;
}

export default Spinner;
