import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type SpinnerProps = {
	type?: keyof typeof Spinners;
	className?: string;
};

const Spinners = {
	default: faSpinner,
};

function Spinner({ type = 'default', className }: SpinnerProps) {
	return <FontAwesomeIcon icon={Spinners[type]} className={className} spin />;
}

export default Spinner;
