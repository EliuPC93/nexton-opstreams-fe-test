import { DataService } from './data.service';
import { RequestInfo } from 'angular-in-memory-web-api';

describe('DataService', () => {
    let service: DataService;

    beforeEach(() => {
        service = new DataService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('createDb', () => {
        it('returns db object with schemas and requests', () => {
            const db = service.createDb();

            expect(db).toBeDefined();
            expect(db['schemas']).toBeDefined();
            expect(db['requests']).toBeDefined();
        });

        it('contains two schemas: software-request and hardware-request', () => {
            const db = service.createDb();
            const schemas = db['schemas'];

            expect(schemas.length).toBeGreaterThanOrEqual(2);
            const ids = schemas.map((s: any) => s.id);
            expect(ids).toContain('software-request');
            expect(ids).toContain('hardware-request');
        });

        it('software-request schema has required structure', () => {
            const db = service.createDb();
            const swSchema = db['schemas'].find((s: any) => s.id === 'software-request');

            expect(swSchema).toBeDefined();
            if (swSchema) {
                expect(swSchema.title).toBe('Software Request');
                expect(swSchema.sections).toBeDefined();
                expect(swSchema.sections.length).toBeGreaterThan(0);
            }
        });

        it('schemas have sections with fields', () => {
            const db = service.createDb();
            const schema = db['schemas'][0];

            expect(schema.sections[0].id).toBeDefined();
            expect(schema.sections[0].title).toBeDefined();
            expect(schema.sections[0].fields).toBeDefined();
            expect(schema.sections[0].fields.length).toBeGreaterThan(0);
        });

        it('fields have required properties', () => {
            const db = service.createDb();
            const field = db['schemas'][0].sections[0].fields[0];

            expect(field.id).toBeDefined();
            expect(field.label).toBeDefined();
            expect(field.type).toBeDefined();
            expect(field.required).toBeDefined();
        });

        it('contains requests collection with question arrays', () => {
            const db = service.createDb();
            const requests = db['requests'];

            expect(requests).toBeDefined();
            expect(requests.length).toBeGreaterThan(0);
            expect(requests[0].id).toBeDefined();
            expect(requests[0].question).toBeDefined();
        });
    });

    describe('put', () => {
        let db: any;
        let mockUtils: any;

        beforeEach(() => {
            db = service.createDb();
            mockUtils = {
                createResponse$: jasmine.createSpy('createResponse$').and.callFake((fn: Function) => {
                    const response = fn();
                    return { status: response.status, body: response.body };
                })
            };
        });

        it('updates a question in the request and returns 200', () => {
            const reqInfo: any = {
                url: '/api/requests/requested-item/question/1758177604',
                req: { url: '/api/requests/requested-item/question/1758177604', body: { value: 'Updated Item' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(mockUtils.createResponse$).toHaveBeenCalled();
            expect(result.status).toBe(200);
            expect(result.body.value).toBe('Updated Item');
        });

        it('handles string request IDs like "requested-item"', () => {
            const reqInfo: any = {
                url: 'api/requests/requested-item/question/75484637462',
                req: { url: 'api/requests/requested-item/question/75484637462', body: { value: 999 } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(200);
            expect(result.body.value).toBe(999);
        });

        it('returns 404 when request ID not found', () => {
            const reqInfo: any = {
                url: 'api/requests/nonexistent/question/1758177604',
                req: { url: 'api/requests/nonexistent/question/1758177604', body: { value: 'test' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(404);
            expect(result.body.error).toContain('not found');
        });

        it('returns 404 when question ID not found in request', () => {
            const reqInfo: any = {
                url: 'api/requests/requested-item/question/99999999999',
                req: { url: 'api/requests/requested-item/question/99999999999', body: { value: 'test' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(404);
            expect(result.body.error).toContain('not found');
        });

        it('returns 400 for malformed URL', () => {
            const reqInfo: any = {
                url: 'api/invalid/endpoint',
                req: { url: 'api/invalid/endpoint', body: { value: 'test' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(400);
            expect(result.body.error).toContain('Bad Request');
        });

        it('preserves existing question properties not in update body', () => {
            const reqInfo: any = {
                url: 'api/requests/requested-item/question/1758177604',
                req: { url: 'api/requests/requested-item/question/1758177604', body: { newProp: 'extra' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(200);
            expect(result.body.id).toBe(1758177604);
            expect(result.body.newProp).toBe('extra');
        });

        it('handles numeric question IDs correctly', () => {
            const reqInfo: any = {
                url: 'api/requests/vendor-info/question/4957463729',
                req: { url: 'api/requests/vendor-info/question/4957463729', body: { value: 'Acme Corp' } },
                collection: db['requests'],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(200);
            expect(result.body.value).toBe('Acme Corp');
        });

        it('works with questions array named "questions"', () => {
            const customRequest = {
                id: 'custom-request',
                questions: [{ id: 12345, value: 'old' }]
            };
            const reqInfo: any = {
                url: 'api/requests/custom-request/question/12345',
                req: { url: 'api/requests/custom-request/question/12345', body: { value: 'new' } },
                collection: [customRequest],
                utils: mockUtils
            };

            const result: any = service.put(reqInfo);

            expect(result.status).toBe(200);
            expect(result.body.value).toBe('new');
        });
    });
});
