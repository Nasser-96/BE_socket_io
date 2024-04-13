import { NamespaceClass } from 'src/classes/Namespace';
import { Room } from 'src/classes/Room';

export class MyNameSpaces {
  private wikiNs: NamespaceClass;
  private mozNs: NamespaceClass;
  private linuxNs: NamespaceClass;
  private namespaces: NamespaceClass[];

  constructor() {
    this.wikiNs = new NamespaceClass(
      0,
      'Wikipedia',
      'https://i.insider.com/5fbd515550e71a001155724f?width=700',
      '/wiki',
    );
    this.wikiNs.addRoom(new Room(0, 'New Articles', 0));
    this.wikiNs.addRoom(new Room(1, 'Editors', 0));
    this.wikiNs.addRoom(new Room(2, 'Other', 0));

    this.mozNs = new NamespaceClass(
      1,
      'Mozilla',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png',
      '/mozilla',
    );
    this.mozNs.addRoom(new Room(0, 'Firefox', 1));
    this.mozNs.addRoom(new Room(1, 'SeaMonkey', 1));
    this.mozNs.addRoom(new Room(2, 'SpiderMonkey', 1));
    this.mozNs.addRoom(new Room(3, 'Rust', 1));

    this.linuxNs = new NamespaceClass(
      2,
      'Linux',
      'https://cdn.pixabay.com/photo/2013/07/13/11/43/tux-158547_640.png',
      '/linux',
    );
    this.linuxNs.addRoom(new Room(0, 'Debian', 2));
    this.linuxNs.addRoom(new Room(1, 'Red Hat', 2));
    this.linuxNs.addRoom(new Room(2, 'Ubunto', 2));
    this.linuxNs.addRoom(new Room(3, 'Mac OS', 2));
    this.namespaces = [this.wikiNs, this.mozNs, this.linuxNs];
  }

  getMyNameSpaces() {
    return this.namespaces;
  }
}
