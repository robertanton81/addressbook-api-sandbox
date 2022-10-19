import { Migration } from '@mikro-orm/migrations';

export class Migration20221019210637 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "password" varchar(255) not null, "email" varchar(50) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
