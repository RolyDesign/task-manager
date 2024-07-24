import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppInfoService {
  constructor() {}

  public get title() {
    return 'Task Manager';
  }
  public get description() {
    return 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis a praesentium aut eum dicta incidunt quaerat soluta eligendi, temporibus eveniet magnam sed nobis optio quas doloremque. Iste eaque architecto exercitationem odit a labore cum tempore ab doloribus ipsa necessitatibus earum totam maxime ipsam saepe neque ipsum esse et beatae est, cumque itaque autem? Suscipit odio commodi ea repudiandae consectetur deserunt, ducimus autem aperiam nam dolorem, mollitia vitae labore omnis tenetur possimus odit atque molestiae quibusdam a fugit cupiditate at. Sunt laboriosam itaque molestiae aspernatur reiciendis, odit inventore ratione animi quas eveniet sequi dignissimos doloremque corrupti eos dolores praesentium hic repellat.';
  }
  public get currentYear() {
    return new Date().getFullYear();
  }
  public get version() {
    return 'version 1.0';
  }
}
