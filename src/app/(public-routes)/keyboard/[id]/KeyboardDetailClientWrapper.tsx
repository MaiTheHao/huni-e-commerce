'use client';
import React from 'react';
import { IKeyboard } from '@/interfaces';

type Props = {
	keyboard: IKeyboard;
};

function KeyboardDetailClientWrapper({ keyboard }: Props) {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<th>Model Name</th>
						<td>{keyboard.modelName}</td>
					</tr>
					<tr>
						<th>Case Material</th>
						<td>{keyboard.caseMaterial}</td>
					</tr>
					<tr>
						<th>Collab</th>
						<td>{keyboard.collab ?? 'N/A'}</td>
					</tr>
					<tr>
						<th>Connectivity</th>
						<td>{keyboard.connectivity.join(', ')}</td>
					</tr>
					<tr>
						<th>Hotswap</th>
						<td>{keyboard.hotswap ? 'Yes' : 'No'}</td>
					</tr>
					<tr>
						<th>Layout</th>
						<td>{keyboard.layout}</td>
					</tr>
					<tr>
						<th>Rapid Trigger</th>
						<td>{keyboard.rapidTrigger ? 'Yes' : 'No'}</td>
					</tr>
					<tr>
						<th>RGB</th>
						<td>{keyboard.rgb ? 'Yes' : 'No'}</td>
					</tr>
					<tr>
						<th>Series</th>
						<td>{keyboard.series ?? 'N/A'}</td>
					</tr>
					<tr>
						<th>Switch Type</th>
						<td>{typeof keyboard.switchType === 'string' ? keyboard.switchType : JSON.stringify(keyboard.switchType)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default KeyboardDetailClientWrapper;
