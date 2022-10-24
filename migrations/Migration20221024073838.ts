import { Migration } from '@mikro-orm/migrations';

export class Migration20221024073838 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "address_book" ("id" serial primary key, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "password" varchar(255) not null, "email" varchar(50) not null);');
    this.addSql('alter table "address_book" add constraint "address_book_email_unique" unique ("email");');

    this.addSql('create table "contact" ("id" serial primary key, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone_number" varchar(255) not null, "address" varchar(255) not null, "address_book_id" int not null);');

    this.addSql('alter table "contact" add constraint "contact_address_book_id_foreign" foreign key ("address_book_id") references "address_book" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contact" drop constraint "contact_address_book_id_foreign";');

    this.addSql('drop table if exists "address_book" cascade;');

    this.addSql('drop table if exists "contact" cascade;');
  }

}
