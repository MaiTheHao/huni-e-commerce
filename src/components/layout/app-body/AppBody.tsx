import React from 'react';
import styles from './AppBody.module.scss';
import clsx from 'clsx';

export type AppBodyProps = {
	mainClassName?: string;
	sectionClassName?: string;
	children: React.ReactNode;
};

function AppBody({ children, mainClassName, sectionClassName }: AppBodyProps) {
	return (
		<main className={clsx('app-container', styles.container, mainClassName)}>
			<section className={clsx('app-block', 'app-body', styles.body, sectionClassName)}>{children}</section>
		</main>
	);
}

export default AppBody;
