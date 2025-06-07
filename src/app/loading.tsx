'use client';
import AppBody from '@/components/layout/app-body/AppBody';
import Loading from '@/components/ui/loading/Loading';
import React from 'react';

function loading({}) {
	return (
		<AppBody>
			<Loading loadingText='Đang chuyển trang' />
		</AppBody>
	);
}

export default loading;
