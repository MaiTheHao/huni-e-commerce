# Hướng dẫn thiết lập Server Next.js với Mongoose (A-Z)

## 1. Tổng quan về kiến trúc Serverless vs Traditional Server

### Traditional Server (NestJS hiện tại)

-   Server chạy liên tục 24/7
-   Connection pool duy trì kết nối database
-   Dependency Injection container
-   Module system

### Serverless (Next.js API Routes)

-   Function chạy theo từng request
-   Cold start - connection mới mỗi lần
-   Stateless functions
-   File-based routing

## 2. Cấu trúc thư mục cho Next.js Server

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── verify-email/route.ts
│   │   ├── products/
│   │   │   ├── keyboards/
│   │   │   │   ├── route.ts      # GET, POST /api/products/keyboards
│   │   │   │   ├── [id]/route.ts # GET, PUT, DELETE /api/products/keyboards/[id]
│   │   │   │   └── search/route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   └── globals.css
├── lib/                          # Core business logic
│   ├── database/
│   │   ├── connection.ts         # Singleton connection
│   │   ├── models/              # Mongoose models
│   │   │   ├── user.model.ts
│   │   │   ├── keyboard.model.ts
│   │   │   └── index.ts
│   │   └── schemas/             # Mongoose schemas
│   │       ├── user.schema.ts
│   │       └── keyboard.schema.ts
│   ├── repositories/            # Data access layer
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   ├── keyboard.repository.ts
│   │   └── index.ts
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── keyboard.service.ts
│   │   ├── response.service.ts
│   │   └── index.ts
│   ├── utils/                   # Utilities
│   │   ├── hash.util.ts
│   │   ├── token.util.ts
│   │   ├── cookie.util.ts
│   │   └── validation.util.ts
│   ├── types/                   # TypeScript types
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│   └── constants/
│       ├── database.const.ts
│       └── auth.const.ts
├── middleware.ts                # Next.js middleware
└── next.config.js
```

## 3. Thiết lập Database Connection (Singleton Pattern)

### 3.1 Database Connection Manager

```typescript
// lib/database/connection.ts
import mongoose from 'mongoose';

interface ConnectionObject {
	isConnected?: number;
}

const connection: ConnectionObject = {};

export async function connectToDatabase(): Promise<void> {
	// Nếu đã kết nối, return luôn
	if (connection.isConnected) {
		console.log('Already connected to database');
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI!, {
			dbName: process.env.DB_NAME || 'ecommerce',
		});

		connection.isConnected = db.connections[0].readyState;
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('Database connection failed:', error);
		throw error;
	}
}

export async function disconnectFromDatabase(): Promise<void> {
	if (connection.isConnected) {
		await mongoose.disconnect();
		connection.isConnected = 0;
		console.log('MongoDB disconnected');
	}
}
```

### 3.2 Environment Variables

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ecommerce_huni
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
EMAIL_SERVICE_API_KEY=your-email-service-key
```

## 4. Mongoose Models và Schemas

### 4.1 Base Schema với Timestamps

```typescript
// lib/database/schemas/base.schema.ts
import { Schema } from 'mongoose';

export const baseSchemaOptions = {
	timestamps: true,
	versionKey: false,
	toJSON: {
		transform: function (doc: any, ret: any) {
			ret.id = ret._id;
			delete ret._id;
			delete ret.__v;
			return ret;
		},
	},
};

export const addBaseFields = (schema: Schema) => {
	schema.set('timestamps', true);
	schema.set('versionKey', false);
};
```

### 4.2 User Schema

```typescript
// lib/database/schemas/user.schema.ts
import { Schema } from 'mongoose';
import { IUser } from '@/lib/types';
import { baseSchemaOptions } from './base.schema';

export const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		salt: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			default: null,
		},
		roles: {
			type: [String],
			default: ['user'],
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
	},
	baseSchemaOptions
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
```

### 4.3 Model Factory

```typescript
// lib/database/models/index.ts
import mongoose from 'mongoose';
import { userSchema } from '../schemas/user.schema';
import { keyboardSchema } from '../schemas/keyboard.schema';
import { IUser, IKeyboard } from '@/lib/types';

// Singleton pattern for models
export const getModels = () => {
	return {
		User: mongoose.models.User || mongoose.model<IUser>('User', userSchema),
		Keyboard: mongoose.models.Keyboard || mongoose.model<IKeyboard>('Keyboard', keyboardSchema),
		// Thêm các model khác...
	};
};
```

## 5. Repository Pattern cho Serverless

### 5.1 Base Repository

```typescript
// lib/repositories/base.repository.ts
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { connectToDatabase } from '@/lib/database/connection';

export abstract class BaseRepository<T extends Document> {
	constructor(protected model: Model<T>) {}

	// Đảm bảo connection trước mỗi operation
	private async ensureConnection(): Promise<void> {
		await connectToDatabase();
	}

	async create(data: Partial<T>): Promise<T> {
		await this.ensureConnection();
		const document = new this.model(data);
		return document.save();
	}

	async findById(id: string): Promise<T | null> {
		await this.ensureConnection();
		return this.model.findById(id).exec();
	}

	async findOne(filter: FilterQuery<T>): Promise<T | null> {
		await this.ensureConnection();
		return this.model.findOne(filter).exec();
	}

	async findMany(
		filter: FilterQuery<T> = {},
		options: {
			page?: number;
			limit?: number;
			sort?: any;
		} = {}
	): Promise<{ data: T[]; total: number; pagination: any }> {
		await this.ensureConnection();

		const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
			this.model.countDocuments(filter).exec(),
		]);

		return {
			data,
			total,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasNext: page * limit < total,
				hasPrev: page > 1,
			},
		};
	}

	async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
		await this.ensureConnection();
		return this.model.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }).exec();
	}

	async delete(id: string): Promise<T | null> {
		await this.ensureConnection();
		return this.model.findByIdAndDelete(id).exec();
	}

	async count(filter: FilterQuery<T> = {}): Promise<number> {
		await this.ensureConnection();
		return this.model.countDocuments(filter).exec();
	}
}
```

### 5.2 User Repository

```typescript
// lib/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { getModels } from '@/lib/database/models';
import { IUser, IUserDocument } from '@/lib/types';

export class UserRepository extends BaseRepository<IUserDocument> {
	constructor() {
		const { User } = getModels();
		super(User);
	}

	async createUser(
		userData: Omit<IUser, '_id' | 'roles' | 'isEmailVerified' | 'phone' | 'createdAt' | 'updatedAt'>
	): Promise<IUserDocument> {
		return this.create(userData);
	}

	async findByEmail(email: string): Promise<IUserDocument | null> {
		return this.findOne({ email });
	}

	async verifyEmail(userId: string): Promise<IUserDocument | null> {
		return this.update(userId, { isEmailVerified: true });
	}
}
```

## 6. Service Layer

### 6.1 Response Service

```typescript
// lib/services/response.service.ts
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
	statusCode: number;
}

export class ResponseService {
	static success<T>(data: T, message = 'Success'): ApiResponse<T> {
		return {
			success: true,
			message,
			data,
			statusCode: 200,
		};
	}

	static created<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
		return {
			success: true,
			message,
			data,
			statusCode: 201,
		};
	}

	static error(message = 'Internal server error', statusCode = 500): ApiResponse {
		return {
			success: false,
			message,
			error: message,
			statusCode,
		};
	}

	static badRequest(message = 'Bad request'): ApiResponse {
		return {
			success: false,
			message,
			error: message,
			statusCode: 400,
		};
	}

	static unauthorized(message = 'Unauthorized'): ApiResponse {
		return {
			success: false,
			message,
			error: message,
			statusCode: 401,
		};
	}

	static notFound(message = 'Not found'): ApiResponse {
		return {
			success: false,
			message,
			error: message,
			statusCode: 404,
		};
	}
}
```

### 6.2 Auth Service

```typescript
// lib/services/auth.service.ts
import { UserRepository } from '@/lib/repositories/user.repository';
import { HashUtil } from '@/lib/utils/hash.util';
import { TokenUtil } from '@/lib/utils/token.util';
import { ResponseService } from './response.service';

export class AuthService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	async register(data: { email: string; name: string; password: string }) {
		try {
			// Check if user exists
			const existingUser = await this.userRepository.findByEmail(data.email);
			if (existingUser) {
				return ResponseService.badRequest('User already exists');
			}

			// Hash password
			const salt = HashUtil.generateSalt();
			const hashedPassword = HashUtil.hashPassword(data.password, salt);

			// Create user
			const user = await this.userRepository.createUser({
				email: data.email,
				name: data.name,
				password: hashedPassword,
				salt,
			});

			return ResponseService.created({ userId: user._id }, 'User registered successfully');
		} catch (error) {
			console.error('Register error:', error);
			return ResponseService.error('Registration failed');
		}
	}

	async login(data: { email: string; password: string }) {
		try {
			const user = await this.userRepository.findByEmail(data.email);
			if (!user) {
				return ResponseService.unauthorized('Invalid credentials');
			}

			const isValidPassword = HashUtil.comparePassword(data.password, user.salt, user.password);
			if (!isValidPassword) {
				return ResponseService.unauthorized('Invalid credentials');
			}

			if (!user.isEmailVerified) {
				return ResponseService.unauthorized('Please verify your email');
			}

			const accessToken = await TokenUtil.generateAccessToken({
				userId: user._id,
				email: user.email,
				name: user.name,
				roles: user.roles,
			});

			const refreshToken = await TokenUtil.generateRefreshToken({
				userId: user._id,
			});

			return ResponseService.success(
				{
					accessToken,
					refreshToken,
					user: {
						id: user._id,
						email: user.email,
						name: user.name,
						roles: user.roles,
					},
				},
				'Login successful'
			);
		} catch (error) {
			console.error('Login error:', error);
			return ResponseService.error('Login failed');
		}
	}
}
```

## 7. API Routes Implementation

### 7.1 Auth API Routes

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { ValidationUtil } from '@/lib/utils/validation.util';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validation = ValidationUtil.validateRegister(body);
		if (!validation.isValid) {
			return NextResponse.json({ success: false, message: validation.errors.join(', ') }, { status: 400 });
		}

		const authService = new AuthService();
		const result = await authService.register(body);

		return NextResponse.json(result, { status: result.statusCode });
	} catch (error) {
		console.error('Register API error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
}
```

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { CookieUtil } from '@/lib/utils/cookie.util';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const authService = new AuthService();
		const result = await authService.login(body);

		if (result.success && result.data?.refreshToken) {
			const response = NextResponse.json(
				{
					success: result.success,
					message: result.message,
					data: {
						accessToken: result.data.accessToken,
						user: result.data.user,
					},
				},
				{ status: result.statusCode }
			);

			// Set refresh token as httpOnly cookie
			CookieUtil.setRefreshTokenCookie(response, result.data.refreshToken);
			return response;
		}

		return NextResponse.json(result, { status: result.statusCode });
	} catch (error) {
		console.error('Login API error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
}
```

### 7.2 Products API Routes

```typescript
// app/api/products/keyboards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { KeyboardService } from '@/lib/services/keyboard.service';
import { AuthMiddleware } from '@/lib/utils/auth.middleware';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const keyword = searchParams.get('keyword') || '';

		const keyboardService = new KeyboardService();
		const result = await keyboardService.getKeyboards({ page, limit, keyword });

		return NextResponse.json(result, { status: result.statusCode });
	} catch (error) {
		console.error('Get keyboards error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		// Check authentication for admin operations
		const authResult = await AuthMiddleware.verifyAdmin(request);
		if (!authResult.success) {
			return NextResponse.json(authResult, { status: authResult.statusCode });
		}

		const body = await request.json();
		const keyboardService = new KeyboardService();
		const result = await keyboardService.createKeyboard(body);

		return NextResponse.json(result, { status: result.statusCode });
	} catch (error) {
		console.error('Create keyboard error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
}
```

## 8. Middleware và Authentication

### 8.1 Next.js Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { TokenUtil } from '@/lib/utils/token.util';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Protected API routes
	const protectedPaths = [
		'/api/admin',
		'/api/products/keyboards', // POST, PUT, DELETE
		'/api/users',
	];

	const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

	if (isProtectedPath) {
		const authHeader = request.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
		}

		const token = authHeader.split(' ')[1];
		const payload = await TokenUtil.verifyAccessToken(token);

		if (!payload) {
			return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
		}

		// Add user info to headers for API routes
		const response = NextResponse.next();
		response.headers.set('x-user-id', payload.userId);
		response.headers.set('x-user-email', payload.email);
		response.headers.set('x-user-roles', JSON.stringify(payload.roles));

		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/api/((?!auth/login|auth/register|products/keyboards/:path*).*)', // Exclude public routes
	],
};
```

### 8.2 Auth Utility

```typescript
// lib/utils/auth.middleware.ts
import { NextRequest } from 'next/server';
import { TokenUtil } from './token.util';
import { ResponseService } from '@/lib/services/response.service';

export class AuthMiddleware {
	static async verifyToken(request: NextRequest) {
		const authHeader = request.headers.get('authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return ResponseService.unauthorized('No token provided');
		}

		const token = authHeader.split(' ')[1];
		const payload = await TokenUtil.verifyAccessToken(token);

		if (!payload) {
			return ResponseService.unauthorized('Invalid token');
		}

		return ResponseService.success(payload);
	}

	static async verifyAdmin(request: NextRequest) {
		const authResult = await this.verifyToken(request);

		if (!authResult.success) {
			return authResult;
		}

		const user = authResult.data;
		if (!user.roles.includes('admin')) {
			return ResponseService.unauthorized('Admin access required');
		}

		return ResponseService.success(user);
	}
}
```

## 9. Utilities

### 9.1 Hash Utility

```typescript
// lib/utils/hash.util.ts
import crypto from 'crypto';

export class HashUtil {
	static generateSalt(): string {
		return crypto.randomBytes(16).toString('hex');
	}

	static hashPassword(password: string, salt: string): string {
		return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	}

	static comparePassword(password: string, salt: string, hash: string): boolean {
		const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
		return hash === hashVerify;
	}
}
```

### 9.2 Token Utility

```typescript
// lib/utils/token.util.ts
import jwt from 'jsonwebtoken';

interface AccessTokenPayload {
	userId: string;
	email: string;
	name: string;
	roles: string[];
}

interface RefreshTokenPayload {
	userId: string;
}

export class TokenUtil {
	static async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
		return jwt.sign(payload, process.env.JWT_SECRET!, {
			expiresIn: '15m',
		});
	}

	static async generateRefreshToken(payload: RefreshTokenPayload): Promise<string> {
		return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
			expiresIn: '7d',
		});
	}

	static async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
		try {
			return jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload;
		} catch (error) {
			return null;
		}
	}

	static async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
		try {
			return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
		} catch (error) {
			return null;
		}
	}
}
```

## 10. Error Handling và Logging

### 10.1 Global Error Handler

```typescript
// lib/utils/error-handler.ts
import { NextResponse } from 'next/server';

export class ErrorHandler {
	static handle(error: unknown, context: string = 'API') {
		console.error(`[${context}] Error:`, error);

		if (error instanceof Error) {
			// Known error types
			if (error.name === 'ValidationError') {
				return NextResponse.json(
					{
						success: false,
						message: 'Validation failed',
						error: error.message,
					},
					{ status: 400 }
				);
			}

			if (error.name === 'CastError') {
				return NextResponse.json(
					{
						success: false,
						message: 'Invalid ID format',
						error: 'Resource not found',
					},
					{ status: 400 }
				);
			}
		}

		// Default error response
		return NextResponse.json(
			{
				success: false,
				message: 'Internal server error',
				error: process.env.NODE_ENV === 'development' ? error : 'Something went wrong',
			},
			{ status: 500 }
		);
	}
}
```

## 11. Testing

### 11.1 API Testing Setup

```typescript
// lib/test/api.test.ts
import { describe, it, expect } from '@jest/globals';
import { POST } from '@/app/api/auth/register/route';
import { NextRequest } from 'next/server';

describe('Auth API', () => {
	it('should register a new user', async () => {
		const request = new NextRequest('http://localhost:3000/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: 'test@example.com',
				name: 'Test User',
				password: 'password123',
			}),
		});

		const response = await POST(request);
		const data = await response.json();

		expect(response.status).toBe(201);
		expect(data.success).toBe(true);
	});
});
```

## 12. Deployment và Optimization

### 12.1 Vercel Deployment

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['mongoose'],
	},
	env: {
		MONGODB_URI: process.env.MONGODB_URI,
		JWT_SECRET: process.env.JWT_SECRET,
		JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	},
};

module.exports = nextConfig;
```

### 12.2 Performance Optimization

```typescript
// lib/utils/cache.util.ts
const cache = new Map();

export class CacheUtil {
	static set(key: string, value: any, ttl: number = 300000) {
		// 5 minutes default
		const expiry = Date.now() + ttl;
		cache.set(key, { value, expiry });
	}

	static get(key: string): any | null {
		const item = cache.get(key);
		if (!item) return null;

		if (Date.now() > item.expiry) {
			cache.delete(key);
			return null;
		}

		return item.value;
	}

	static clear(): void {
		cache.clear();
	}
}
```

## 13. Migration từ NestJS

### 13.1 Mapping các concepts

| NestJS       | Next.js Equivalent  | Implementation                    |
| ------------ | ------------------- | --------------------------------- |
| @Controller  | API Route files     | app/api/\*/route.ts               |
| @Service     | Service classes     | lib/services/\*.service.ts        |
| @Repository  | Repository classes  | lib/repositories/\*.repository.ts |
| @Injectable  | Class instantiation | Constructor in functions          |
| Guards       | Middleware          | middleware.ts + auth utils        |
| Pipes        | Validation utils    | lib/utils/validation.util.ts      |
| Interceptors | Response utils      | lib/services/response.service.ts  |

### 13.2 Code Migration Steps

1. **Controllers → API Routes**: Convert NestJS controllers to Next.js API route handlers
2. **Services**: Keep business logic, adapt for serverless
3. **Repositories**: Add connection management for each operation
4. **DTOs**: Convert to TypeScript interfaces
5. **Guards**: Implement as middleware
6. **Modules**: Replace with direct imports

## 14. Best Practices cho Serverless

### 14.1 Connection Management

-   Sử dụng singleton pattern cho database connection
-   Reuse connection trong cùng một execution context
-   Đóng connection khi không cần thiết

### 14.2 Performance

-   Minimize cold start time
-   Use connection pooling
-   Cache frequently accessed data
-   Optimize bundle size

### 14.3 Error Handling

-   Graceful error handling
-   Proper HTTP status codes
-   Logging for debugging
-   User-friendly error messages

### 14.4 Security

-   Validate all inputs
-   Use HTTPS only
-   Secure cookie settings
-   Rate limiting
-   CORS configuration

## 15. Monitoring và Debugging

### 15.1 Logging

```typescript
// lib/utils/logger.util.ts
export enum LogLevel {
	ERROR = 'error',
	WARN = 'warn',
	INFO = 'info',
	DEBUG = 'debug',
}

export class Logger {
	static log(level: LogLevel, message: string, meta?: any) {
		const timestamp = new Date().toISOString();
		const logEntry = {
			timestamp,
			level,
			message,
			meta: meta || {},
		};

		if (process.env.NODE_ENV === 'development') {
			console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta || '');
		} else {
			// In production, send to monitoring service
			console.log(JSON.stringify(logEntry));
		}
	}

	static error(message: string, error?: any) {
		this.log(LogLevel.ERROR, message, error);
	}

	static info(message: string, meta?: any) {
		this.log(LogLevel.INFO, message, meta);
	}
}
```

Đây là hướng dẫn chi tiết để migrate từ NestJS sang Next.js serverless architecture. Kiến trúc này sẽ phù hợp với serverless environment trong khi vẫn duy trì được structure và patterns tốt từ backend hiện tại.
