export interface IUpdateOne {
    n: number;
    nModified: number;
    ok: number;
}

export interface IDeleteOne {
    n: number;
    deleteCount: number;
    ok: number;
}

export interface ISave {
    err: Error
}