export interface Comercio {
  id: string;
  categoriaId: string;
  rubroID: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono?: string;
  email?: string;
  web?: string;
  instagram?: string;
  facebook?: string;
  verificado: boolean;
  imagen?: string;
  horario?: string;
}
