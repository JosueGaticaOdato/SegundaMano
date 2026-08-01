-- Esquema para Supabase (Postgres), mismos nombres de campo que tus
-- interfaces TS (camelCase entre comillas para respetar mayusculas).

create table if not exists rubros (
  id            text primary key,
  nombre        text not null,
  descripcion   text default '',
  slug          text unique not null,
  "imagenFondo" text default ''
);

create table if not exists categorias (
  id            text primary key,
  "rubroId"     text not null references rubros(id) on delete cascade,
  nombre        text not null,
  slug          text not null,
  "imagenFondo" text default ''
);

create table if not exists negocios (
  id            text primary key,
  "categoriaId" text references categorias(id) on delete set null,
  "rubroId"     text references rubros(id) on delete set null,
  nombre        text not null,
  descripcion   text default '',
  direccion     text default '',
  telefono      text,
  email         text,
  web           text,
  instagram     text,
  facebook      text,
  verificado    boolean not null default false,
  imagen        text,
  horario       text
);

create index if not exists idx_categorias_rubro on categorias("rubroId");
create index if not exists idx_negocios_categoria on negocios("categoriaId");
create index if not exists idx_negocios_rubro on negocios("rubroId");
