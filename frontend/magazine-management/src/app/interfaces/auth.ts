// IEmailDto
export interface IEmailDto {
  email: string;
}

// IPasswordDto
export interface IPasswordDto {
  password: string;
}

// UserDto
export interface UserDto extends IEmailDto {
  id?: string;
  userName: string;
  emailConfirmed?: boolean;
  lockoutEnabled?: boolean;
  lockoutEnd?: string; // ISO date string or null
  roles: string[];
  createdDate?: string; // ISO date string or null
}

// UserDetailDto
export interface UserDetailDto extends UserDto {
  articles: any[];   // Replace 'any' with the actual Article type if available
  magazines: any[];  // Replace 'any' with the actual Magazine type if available
}

// UpdateUserDto
export interface UpdateUserDto extends IEmailDto {
  userName: string;
  emailConfirmed: boolean;
}

// AssignRoleDto
export interface AssignRoleDto {
  userId: string;
  roleName: string;
}

// AuthResponseDto
export interface AuthResponseDto {
  token: string;
}

// LoginDto
export interface LoginDto extends IEmailDto, IPasswordDto {}

// RegisterDto
export interface RegisterDto extends IEmailDto, IPasswordDto {
  confirmPassword?: string;
  userName?: string;
}

export interface DecodedToken {
	email: string;
	name: string;
	role: string[];
	exp: number;
	jti: string;
}

export interface RegisterResponse {
	message: string;
	success: boolean;
}

