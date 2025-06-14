import { z } from 'zod';

export type InputFieldConfig = {
	type?: 'text' | 'email' | 'password';
	name: string;
	label: string;
	placeholder: string;
	required?: boolean;
};

export type OAuthProvider = {
	name: string;
	iconSrc: string;
	href: string;
};

export type AuthFormProps = {
	title: string;
	subtitle: string;
	fields: InputFieldConfig[];
	submitText: string;
	submitDisabled?: boolean;
	additionalLink?:
		| {
				text: string;
				href: string;
		  }
		| {
				text: string;
				href: string;
		  }[];
	oauthProviders?: OAuthProvider[];
	bottomText?: string;
	bottomLinkText?: string;
	bottomLinkHref?: string;
	validateSchema: z.ZodObject<any>;
	onSubmit?: (formData: Record<string, string>) => void;
};
