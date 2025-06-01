'use client';
import AppBody from '@/components/app-body/AppBody';
import Loading from '@/components/loading/Loading';
import React from 'react';

function loading({}) {
	return (
		<AppBody>
			<Loading loadingText='Đang chuyển trang' />
		</AppBody>
	);
}

export default loading;
