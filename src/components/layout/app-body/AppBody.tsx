import React from 'react';
import styles from './AppBody.module.scss';
import clsx from 'clsx';

export type AppBodyProps = {
	children: React.ReactNode;
};

function AppBody({ children }: AppBodyProps) {
	return (
		<main className={clsx('app-container', styles.container)}>
			<section className={clsx('app-block', 'app-body', styles.body)}>{children}</section>
		</main>
	);
}

export default AppBody;
