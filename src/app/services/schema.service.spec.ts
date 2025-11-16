import { TestBed } from '@angular/core/testing';
import { SchemaService, CurrentSchema } from './schema.service';
import { ProductRequest } from '../product-requests';

describe('SchemaService', () => {
    let service: SchemaService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [SchemaService] });
        service = TestBed.inject(SchemaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setSchema emits schema and index via getSchema$', (done) => {
        const mockSchema: ProductRequest = {
            id: 'software-request',
            title: 'Request 1',
            sections: []
        };

        service.setSchema(mockSchema, 2);

        service.getSchema$().subscribe((current: CurrentSchema) => {
            expect(current.schema).toEqual(mockSchema);
            expect(current.index).toBe(2);
            done();
        });
    });

    it('defaults index to 0 if not provided', (done) => {
        const mockSchema: ProductRequest = {
            id: 'hardware-request',
            title: 'Request 1',
            sections: []
        };

        service.setSchema(mockSchema);

        service.getSchema$().subscribe((current: CurrentSchema) => {
            expect(current.index).toBe(0);
            done();
        });
    });

    it('ReplaySubject replays last value to new subscribers', (done) => {
        const schema1: ProductRequest = { id: 'software-request', title: 'R1', sections: [] };
        const schema2: ProductRequest = { id: 'hardware-request', title: 'R2', sections: [] };

        service.setSchema(schema1, 0);
        service.setSchema(schema2, 1);

        // New subscriber should get the last emitted value immediately
        service.getSchema$().subscribe((current: CurrentSchema) => {
            expect(current.schema.id).toBe('hardware-request');
            expect(current.index).toBe(1);
            done();
        });
    });

    it('handles multiple sequential setSchema calls', (done) => {
        const schema: ProductRequest = { id: 'software-request', title: 'R', sections: [] };
        const values: CurrentSchema[] = [];

        service.getSchema$().subscribe((current: CurrentSchema) => {
            values.push(current);
        });

        service.setSchema(schema, 0);
        service.setSchema(schema, 1);
        service.setSchema(schema, 2);

        setTimeout(() => {
            expect(values.length).toBe(3);
            expect(values[0].index).toBe(0);
            expect(values[1].index).toBe(1);
            expect(values[2].index).toBe(2);
            done();
        }, 50);
    });
});
