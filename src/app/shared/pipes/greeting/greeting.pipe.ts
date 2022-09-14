import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'greeting',
})
export class GreetingPipe implements PipeTransform {
    transform(name: string, gender: string, role: string): any {
        let grt = ';';
        switch (gender) {
            case 'M':
                grt = 'Bienvenido';

                break;
            case 'F':
                grt = 'Bienvenida';

                break;

            default:
                grt = 'Bienvenid@';
                break;
        }
        return `${grt} ${name}, tienes permisos de ${role}`;
    }
}
