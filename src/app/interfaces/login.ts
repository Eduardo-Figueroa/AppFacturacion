export interface NewResponse {
    code:   number;
    status: string;
    data:   Empresa[];
}

export interface Empresa {
    empresa: string;
}

export interface permisosUsuario {
    code:   number;
    status: string;
    data:   permisos[];
}

export interface permisos {
    Cod_Derecho: string;
    Descripcion: string;
    Modulo:      string;
}

