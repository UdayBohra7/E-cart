export type BaseResponse = {
    code: number;
    message: string;
};

export type ApiResponse<T> = BaseResponse & {
    data: T;
};

export type PagedResponse<T> = BaseResponse & {
    data: {
        results: T[];
        limit: number;
        page: number;
        totalPages: number;
        totalResults: number;
    };
};