import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const passwordControl = control.get(password);
		const confirmPasswordControl = control.get(confirmPassword);

		if (!passwordControl || !confirmPasswordControl) {
			return null;
		}

		if (passwordControl.value !== confirmPasswordControl.value) {
			confirmPasswordControl.setErrors({ passwordMismatch: true });
			return { passwordMismatch: true };
		} else {
			confirmPasswordControl.setErrors(null);
			return null;
		}
	};
}

export function strongPasswordValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		if (!value) {
			return null;
		}

		const hasNumber = /[0-9]/.test(value);
		const hasUpper = /[A-Z]/.test(value);
		const hasLower = /[a-z]/.test(value);
		const hasSpecial = /[#?!@$%^&*-]/.test(value);
		const isValidLength = value.length >= 8;

		const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

		if (!passwordValid) {
			return { strongPassword: true };
		}

		return null;
	};
}

// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export class CustomValidators {
// 	static passwordMatch(password: string, confirmPassword: string): ValidatorFn {
// 		return (control: AbstractControl): ValidationErrors | null => {
// 			const passwordControl = control.get(password);
// 			const confirmPasswordControl = control.get(confirmPassword);

// 			if (!passwordControl || !confirmPasswordControl) {
// 				return null;
// 			}

// 			if (passwordControl.value !== confirmPasswordControl.value) {
// 				confirmPasswordControl.setErrors({ passwordMismatch: true });
// 				return { passwordMismatch: true };
// 			} else {
// 				confirmPasswordControl.setErrors(null);
// 				return null;
// 			}
// 		};
// 	}

// 	static strongPassword(): ValidatorFn {
// 		return (control: AbstractControl): ValidationErrors | null => {
// 			const value = control.value;
// 			if (!value) {
// 				return null;
// 			}

// 			const hasNumber = /[0-9]/.test(value);
// 			const hasUpper = /[A-Z]/.test(value);
// 			const hasLower = /[a-z]/.test(value);
// 			const hasSpecial = /[#?!@$%^&*-]/.test(value);
// 			const isValidLength = value.length >= 8;

// 			const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

// 			if (!passwordValid) {
// 				return { strongPassword: true };
// 			}

// 			return null;
// 		};
// 	}
// }
