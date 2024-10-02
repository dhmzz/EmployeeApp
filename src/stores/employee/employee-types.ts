export interface IEmployeeResponse {
    status: boolean;
    message: string;
    data: IEmployeeData;
}

export interface IEmployeeData {
    list: IEmployee[];
    total: number;
    current_page: number;
    total_page: number;
}

export interface IEmployee {
    id?: number;
    name: string;
    gender: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: string;
    departement: string;
    position: string;
    status: string;
}

export interface ISelect {
    id: number,
    title: string
}

export interface IEmployeeRequest {
    id?: number;
    name: string;
    gender: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: string;
    department_id: number;
    job_position_id: number;
}
