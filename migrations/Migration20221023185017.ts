import { Migration } from '@mikro-orm/migrations';

export class Migration20221023185017 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "firebase_user" ("id" serial primary key, "createdAt" timestamptz(6) not null, "updatedAt" timestamptz(6) not null, "firebase_uuid" varchar(50) not null);',
    );
    this.addSql(
      'alter table "firebase_user" add constraint "firebase_user_firebase_uuid_unique" unique ("firebase_uuid");',
    );

    this.addSql('alter table "user" add column "firebase_user_id" int null;');
    this.addSql(
      'alter table "user" add constraint "user_firebase_user_id_foreign" foreign key ("firebase_user_id") references "firebase_user" ("id") on update cascade on delete set null;',
    );
    this.addSql(
      'alter table "user" add constraint "user_firebase_user_id_unique" unique ("firebase_user_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user" drop constraint "user_firebase_user_id_foreign";',
    );

    this.addSql('drop table if exists "firebase_user" cascade;');

    this.addSql(
      'alter table "user" drop constraint "user_firebase_user_id_unique";',
    );
    this.addSql('alter table "user" drop column "firebase_user_id";');
  }
}
