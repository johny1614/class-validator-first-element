import 'reflect-metadata';
import { IsString, registerDecorator, validate, ValidationArguments, ValidationOptions } from 'class-validator';
import { plainToClass, Type } from 'class-transformer';

export function ValidateFirstElementOfArray(nestedClassConstructor, validationOptions?: ValidationOptions) {
	return function(object: Object, propertyName: string) {
		registerDecorator({
			name: 'ValidateFirstElementOfArray',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					return validate(value[0]).then(x => {
						return x.length === 0;
					});
				}
			}
		});
	};
}

export class Dog {
	@IsString()
	name: string;

}

export class DogsCollection {
	@Type(() => Dog)
	@ValidateFirstElementOfArray(Dog)
	dogs: Array<Dog>;
}

const doggie1 = plainToClass(Dog, { name: 'azor' });
const doggie2 = plainToClass(Dog, { name: true });
const doggie3 = plainToClass(Dog, { name: 'Mika' });
const dogCollection = plainToClass(DogsCollection, {
	dogs: [
		doggie2,
		doggie1,
		doggie3
	]
});
validate(dogCollection).then(errors => {
	console.log('dogCollection  validation errors', errors);
});


