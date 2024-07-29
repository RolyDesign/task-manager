# TaskManager

## Ojo

run => npm i -g json-server@0.17.4 Con la version actual no corre el auth con json server
para levantar el server run => json-server-auth -w db.json

## Caracteristicas

La app esta basada en permissions

### Caso eliminar el mismo user que esta logeado

Si un user con permiso de elimar user quiere eliminar su propio user se debio haber desabilitado la accion de eliminacion para ese user en la tabla de user o sea el user que esta logeado no podria eliminarce asi mismo o se pudiera haber permitido la eliminacion pero una ves que eliminara lo sacara de la aplicacion redirigiendolo al login esta implementacion no esta aplicada e la app pero se tubo en cuenta.

### Caso Actualizar user

cuando se actualiza un user se actualiza ademas el lote de tareas que pertenecen a este user esto con una api real no se implementaba en el cliente pero por cuestiones de funcionalidad de la app lo implemente para que cuando se actualize un user se actualicen ademas las tareas relacionadas espesificamente los campos UserCreator y InitialsName ademas si el usuario que se desea actualizar es el mismo que esta logueado se actualiza ademas de el user y sus tareas el identity cache en local storage para mantener la sincronizacion , esto susede cuando se edita el perfil que es lo mismo que actualizar un user solo que es el update del userSelf.

### Caso Actualizar user u cambiarle el role

no se esta manejando el caso de que un user admin se cambie el role a user (se deberia redirigir al user a login para que inicie session nuevamente )

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
